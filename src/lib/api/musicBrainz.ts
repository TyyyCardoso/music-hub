import { MusicInfo } from "@/data/musicData"; // Ou onde quer que o teu tipo esteja

const MUSICBRAINZ_API_BASE = "https://musicbrainz.org/ws/2";

const fetchOptions = {
  headers: {
    Accept: "application/json",
  },
};

/**
 * Procura dados de música de um país usando a API do MusicBrainz,
 * incluindo os TOP 5 GÉNEROS dos artistas.
 * @param countryCode O código do país (ex: "BRA")
 * @param countryName O nome completo do país (ex: "Brazil")
 * @returns Uma promessa que resolve para o objeto MusicInfo
 */
export const fetchMusicData = async (
  countryCode: string,
  countryName: string
): Promise<MusicInfo> => {

  // --- PASSO 1: Validar o País (Mantém-se igual) ---
  const areaQuery = encodeURIComponent(`area:"${countryName}" AND type:"Country"`);
  const areaUrl = `${MUSICBRAINZ_API_BASE}/area?query=${areaQuery}&limit=5`;

  const areaRes = await fetch(areaUrl, fetchOptions);
  if (!areaRes.ok) {
    throw new Error(`Falha ao procurar o país (${countryName}) no MusicBrainz.`);
  }

  const areaData = await areaRes.json();
  const area = areaData.areas?.find((a: any) => a.type === "Country");
  const areaId = area?.id;

  if (!areaId) {
    throw new Error(`País "${countryName}" (tipo: Country) não encontrado no MusicBrainz.`);
  }

  // --- PASSO 2: Buscar Artistas (Mantém-se igual) ---
  const artistQuery = encodeURIComponent(`area:"${countryName}"`);
  const artistUrl = `${MUSICBRAINZ_API_BASE}/artist?query=${artistQuery}&limit=5`;

  const artistsRes = await fetch(artistUrl, fetchOptions);
  if (!artistsRes.ok) {
    throw new Error("Falha ao procurar artistas para este país.");
  }

  const artistsData = await artistsRes.json();
  const artistsList = artistsData.artists || [];

  // --- PASSO 3: Buscar e Classificar os TOP 5 Géneros (LÓGICA ATUALIZADA) ---

  const genrePromises = artistsList.map((artist: any) => {
    const artistId = artist.id;
    const genreUrl = `${MUSICBRAINZ_API_BASE}/artist/${artistId}?inc=genres`;
    return fetch(genreUrl, fetchOptions).then(res => {
      if (!res.ok) return null;
      return res.json();
    });
  });

  const artistsWithGenres = await Promise.all(genrePromises);

  // Usamos um Map para somar a popularidade (count) de cada género
  const genreCounts = new Map<string, number>();

  artistsWithGenres
    .filter(data => data != null) // Filtra chamadas falhadas
    .flatMap((artistData: any) => artistData.genres || []) // Junta todos os géneros
    .filter((g: any) => g.count > 0) // Apenas géneros com votos
    .forEach((g: any) => {
      const name = g.name;
      const count = g.count;
      // Soma o count ao total desse género
      genreCounts.set(name, (genreCounts.get(name) || 0) + count);
    });

  // Converte o Map para um array [ [nome, count], ... ]
  const sortedGenres = Array.from(genreCounts.entries())
    // Ordena pelo count (descendente)
    .sort(([, countA], [, countB]) => countB - countA);

  // Mapeia apenas os nomes dos 5 primeiros
  const top5Genres = sortedGenres
    .slice(0, 5)
    .map(([name]) => name);

  // --- PASSO 4: Montar a resposta ---
  return {
    code: countryCode,
    country: countryName,
    artists: artistsList.map((artist: any) => artist.name),
    genres: top5Genres, // Aqui está o Top 5!
    description: `Música popular de ${countryName}.`,
    funFact: "",
  };
};

/**
 * Busca uma música aleatória dos 5 géneros mais populares mundialmente.
 * Ordena por rating e escolhe aleatoriamente uma das top 200.
 * Retorna um objecto com `title` e `artist` ou `null` se não encontrar.
 */
export const fetchRandomPopularTrack = async (
  usedTitles: Set<string> = new Set(),
  usedArtists: Set<string> = new Set()
): Promise<{ title: string; artist: string } | null> => {
  try {
    const topGenres = ['pop', 'rock', 'hip-hop', 'electronic', 'dance'];
    const genreQuery = topGenres.map(g => `tag:"${g}"`).join(' OR ');
    const url = `https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(genreQuery)}&limit=300&fmt=json`;

    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;

    const data = await res.json();
    const recordings: any[] = data.recordings || [];
    if (recordings.length === 0) return null;

    // Ordena por rating.count
    const recordingsSorted = recordings.slice().sort((a, b) => {
      const aCount = a.rating?.count || 0;
      const bCount = b.rating?.count || 0;
      return bCount - aCount;
    });

    // Seleciona as top 200
    const topN = recordingsSorted.slice(0, Math.min(200, recordingsSorted.length));

    // Filtra títulos e artistas já usados
    const filtered = topN.filter(r => {
      const title = r.title?.trim();
      const artistCredit = r['artist-credit'] || [];
      const artistName = artistCredit[0]?.name || r.artist?.name || '';
      return title && artistName && !usedTitles.has(title) && !usedArtists.has(artistName);
    });

    if (filtered.length === 0) return null;

    const choice = filtered[Math.floor(Math.random() * filtered.length)];
    const artistCredit = choice['artist-credit'] || [];
    const artistName = artistCredit[0]?.name || choice.artist?.name || 'Unknown Artist';
    const title = choice.title || 'Unknown Title';

    return { title, artist: artistName };
  } catch (err) {
    console.error('fetchRandomPopularTrack error:', err);
    return null;
  }
};

export interface Release {
  artist: string;
  album: string;
  date: string;
  genre: string;
  type: "Album" | "Single" | "EP";
  imageUrl?: string;
  link?: string;
}

/**
 * Fetches top new albums from iTunes RSS feed.
 * Note: This feed provides "Top Albums" which are usually recent releases or pre-orders.
 */
export const fetchNewReleases = async (): Promise<Release[]> => {
  try {
    // iTunes RSS Feed for Top Albums (US)
    const url = "https://itunes.apple.com/us/rss/topalbums/limit=100/json";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch releases from iTunes");

    const data = await res.json();
    const entries = data.feed?.entry || [];

    const mappedReleases = entries.map((entry: any) => {
      const artist = entry["im:artist"]?.label || "Unknown Artist";
      const album = entry["im:name"]?.label || "Unknown Album";
      const date = entry["im:releaseDate"]?.label || ""; // Format: YYYY-MM-DD usually
      const genre = entry["category"]?.attributes?.term || "Pop";
      const imageUrl = entry["im:image"]?.[2]?.label || ""; // 170x170 image
      const link = entry["link"]?.attributes?.href || "";

      return {
        artist,
        album,
        date,
        genre,
        type: "Album", // iTunes feed doesn't explicitly distinguish, usually albums
        imageUrl,
        link
      };
    });

    // Filter for releases in the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentReleases = mappedReleases.filter((r: any) => {
      const releaseDate = new Date(r.date);
      return releaseDate >= sixMonthsAgo;
    });

    // Sort by date descending (Newest first)
    return recentReleases.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching new releases:", error);
    return [];
  }
};
