const API_KEY = "883ec09f1051222ba3742aa89d473b6e";
const BASE_URL = "https://ws.audioscrobbler.com/2.0/";

// --- Interfaces ---

export interface LastFmImage {
    "#text": string;
    size: "small" | "medium" | "large" | "extralarge";
}

export interface LastFmArtist {
    name: string;
    mbid?: string;
    url: string;
}

export interface LastFmTrack {
    name: string;
    playcount: string;
    listeners: string;
    mbid?: string;
    url: string;
    streamable: string;
    artist: LastFmArtist;
    image: LastFmImage[];
    "@attr"?: {
        rank: string;
    };
}

export interface LastFmAlbum {
    name: string;
    playcount: number | string;
    mbid?: string;
    url: string;
    artist: LastFmArtist;
    image: LastFmImage[];
}

export interface LastFmTopTracksResponse {
    toptracks: {
        track: LastFmTrack[];
        "@attr": {
            artist: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

export interface LastFmTopAlbumsResponse {
    topalbums: {
        album: LastFmAlbum[];
        "@attr": {
            artist: string;
            page: string;
            perPage: string;
            totalPages: string;
            total: string;
        };
    };
}

export interface ArtistDetails {
    topTracks: LastFmTopTracksResponse["toptracks"];
    topAlbums: LastFmTopAlbumsResponse["topalbums"];
}

// --- API Functions ---

export async function getArtistTopTracks(artist: string, page: number = 1, limit: number = 5): Promise<LastFmTopTracksResponse> {
    const url = `${BASE_URL}?method=artist.gettoptracks&artist=${encodeURIComponent(
        artist
    )}&api_key=${API_KEY}&format=json&page=${page}&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao obter top músicas");
    return res.json();
}

export async function getArtistTopAlbums(artist: string, page: number = 1, limit: number = 5): Promise<LastFmTopAlbumsResponse> {
    const url = `${BASE_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(
        artist
    )}&api_key=${API_KEY}&format=json&page=${page}&limit=${limit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao obter top álbuns");
    return res.json();
}

export async function getArtistDetails(artist: string): Promise<ArtistDetails> {
    try {
        const [tracksData, albumsData] = await Promise.all([
            getArtistTopTracks(artist),
            getArtistTopAlbums(artist)
        ]);

        return {
            topTracks: tracksData.toptracks,
            topAlbums: albumsData.topalbums
        };
    } catch (error) {
        console.error("Error fetching artist details:", error);
        throw new Error("Failed to load artist details");
    }
}
