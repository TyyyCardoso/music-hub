const API_KEY = "86bgtq4cB2Cf82BUfWKqo9DV258X1r6U";

export async function fetchEvents(artist?: string, country?: string) {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
      classificationName: "Music",
      locale: "*",
      size: "100"
    });

    if (artist) params.append("keyword", artist);
    if (country) params.append("countryCode", country);

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${params.toString()}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Ticketmaster returned an error");

    const data = await res.json();
    const events = data?._embedded?.events ?? [];

    // Transformar + limpar
    const cleanEvents = events
      .map((event: any) => {
        const venue = event._embedded?.venues?.[0];
        const attractions = event._embedded?.attractions || [];

        const date = event?.dates?.start?.localDate;
        if (!date) return null; // ignorar eventos sem data

        return {
          id: event.id,
          title: event.name,
          date,
          time: event?.dates?.start?.localTime || null,
          artists: attractions.map((a: any) => a.name).filter(Boolean),
          venue: venue?.name || null,
          city: venue?.city?.name || null,
          state: venue?.state?.stateCode || null,
          country: venue?.country?.countryCode || null,
          image: event.images?.[0]?.url ?? null,
          url: event.url || null,
        };
      })
      .filter((e: any) =>
        // garantir que devolvemos só o “bom”
        e &&
        e.title &&
        e.artists.length > 0 &&
        e.venue &&
        e.city &&
        e.country &&
        e.date
      );

    return cleanEvents;
  } catch (err) {
    console.error("fetchEvents error:", err);
    return [];
  }
}

export async function fetchUpcomingEvents(artist?: string, country?: string) {
  const apiKey = API_KEY;

  if (!apiKey) {
    console.error("❌ API KEY missing");
    return [];
  }

  // Conversão Nome → Código ISO
  const isoMap: Record<string, string> = {
    Portugal: "PT",
    Spain: "ES",
    France: "FR",
    Germany: "DE",
    "United States of America": "US",
    // adiciona mais conforme necessário
  };

  const countryCode = country && isoMap[country] ? isoMap[country] : "";

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events");
  url.searchParams.set("apikey", apiKey);
  url.searchParams.set("classificationName", "Music");

  if (artist) url.searchParams.set("keyword", artist);
  if (countryCode) url.searchParams.set("countryCode", countryCode);
  url.searchParams.set("locale", "*");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (!data._embedded || !data._embedded.events) return [];

    return data._embedded.events.map((ev: any) => ({
      id: ev.id,
      title: ev.name,
      artists: ev._embedded?.attractions?.map((a: any) => a.name) || [],
      country: ev._embedded?.venues?.[0]?.country?.name || "",
      city: ev._embedded?.venues?.[0]?.city?.name || "",
      venue: ev._embedded?.venues?.[0]?.name || "",
      date: ev.dates?.start?.dateTime,
      url: ev.url || ""
    }));
  } catch (e) {
    console.error("Erro ao buscar eventos", e);
    return [];
  }
}
