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
export const fetchRandomPopularTrack = async (): Promise<{ title: string; artist: string } | null> => {
  try {
    // Top 5 géneros mais populares mundialmente
    const topGenres = ['pop', 'rock', 'hip-hop', 'electronic', 'dance'];
    
    // Monta query OR com os 5 géneros
    const genreQuery = topGenres.map(g => `tag:"${g}"`).join(' OR ');
    const url = `${MUSICBRAINZ_API_BASE}/recording?query=${encodeURIComponent(genreQuery)}&limit=200&fmt=json`;

    const res = await fetch(url, fetchOptions);
    if (!res.ok) return null;

    const data = await res.json();
    const recordings: any[] = data.recordings || [];
    if (recordings.length === 0) return null;

    // Ordena todas as gravações por rating.count (quando disponível), desc
    const recordingsSorted = recordings.slice().sort((a, b) => {
      const aCount = (a.rating && typeof a.rating.count === 'number') ? a.rating.count : 0;
      const bCount = (b.rating && typeof b.rating.count === 'number') ? b.rating.count : 0;
      return bCount - aCount;
    });

    // Seleciona as até 200 mais populares
    const topN = recordingsSorted.slice(0, Math.min(200, recordingsSorted.length));
    const choice = topN[Math.floor(Math.random() * topN.length)];
    if (!choice) return null;

    // Extrair artista principal de artist-credit
    const artistCredit = choice['artist-credit'] || [];
    let artistName = '';
    if (artistCredit.length > 0) {
      // normalmente o primeiro é o artista principal
      const first = artistCredit[0];
      artistName = first.name || (first.artist && first.artist.name) || '';
    } else if (choice['artist'] && choice['artist'].name) {
      artistName = choice['artist'].name;
    }

    return {
      title: choice.title || 'Unknown Title',
      artist: artistName || 'Unknown Artist',
    };
  } catch (err) {
    // Não alteramos comportamento existente, apenas log e devolvemos null
    // (chamador deve tratar null)
    // eslint-disable-next-line no-console
    console.error('fetchRandomPopularTrack error:', err);
    return null;
  }
};

