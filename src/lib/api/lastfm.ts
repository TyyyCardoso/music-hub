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

// --- YouTube enrichment helpers ---

/**
 * Attempts to find a YouTube video ID for a given artist + track name using
 * the YouTube Data API v3. Requires `VITE_YOUTUBE_API_KEY` to be set in the
 * environment. If the key is not present or no result is found, returns null.
 */
export async function getYouTubeVideoIdForTrack(artist: string, track: string): Promise<string | null> {
    const YT_KEY = import.meta.env?.VITE_YOUTUBE_API_KEY;
    console.log('YouTube API Key present:', !!YT_KEY);
    
    if (!YT_KEY) {
        console.warn('VITE_YOUTUBE_API_KEY not configured');
        return null;
    }

    const query = encodeURIComponent(`${artist} ${track}`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${query}&key=${YT_KEY}`;
    
    try {
        console.log('Fetching from YouTube API...');
        const res = await fetch(url);
        if (!res.ok) {
            const errorText = await res.text();
            console.warn('YouTube search failed:', res.status, errorText);
            return null;
        }
        const data = await res.json();
        console.log('YouTube API response:', data);
        
        if (data.items && data.items.length > 0 && data.items[0].id && data.items[0].id.videoId) {
            return data.items[0].id.videoId as string;
        }
        return null;
    } catch (err) {
        console.error('Error searching YouTube for', artist, track, err);
        return null;
    }
}
