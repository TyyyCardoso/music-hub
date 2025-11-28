import { useState, useCallback, memo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// --- 1. TIPO RENOMEADO e importação da API ---
import { musicDataByCountry, MusicInfo } from "@/data/musicData"; // Alterado de CountryMusic
import { Lightbulb, Loader2, ChevronLeft, ChevronRight } from "lucide-react"; // Adicionado Loader2 e Icons
import { fetchMusicData } from "@/lib/api/musicBrainz"; // Ajusta este caminho se necessário
import { getArtistDetails, getArtistTopTracks, getArtistTopAlbums, getYouTubeVideoIdForTrack, ArtistDetails, LastFmTrack, LastFmAlbum } from "@/lib/api/lastfm";
import YouTubePlayer from "@/components/YouTubePlayer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Constantes movidas para fora do componente ---
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// --- Tipos para os componentes do mapa ---
interface MapGeography {
  id: string;
  rsmKey: string;
  // Adiciona outras propriedades do 'geo' se necessário
}

type MemoizedCountryProps = {
  geo: MapGeography;
  hasData: boolean;
  isSelected: boolean;
  onMouseEnter: (countryCode: string) => void;
  onMouseLeave: () => void;
  onClick: (geo: MapGeography) => void;
};

// --- Componente de País Memorizado para Performance ---
const CountryGeography = ({
  geo,
  hasData,
  isSelected,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: MemoizedCountryProps) => {
  const countryCode = geo.id;

  return (
    <Geography
      key={geo.rsmKey}
      geography={geo}
      onMouseEnter={() => {
        if (hasData) onMouseEnter(countryCode);
      }}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(geo)}
      style={{
        // --- Estilos "martelados" substituídos por variáveis do tema ---
        default: {
          fill: hasData
            ? isSelected
              ? "hsl(var(--secondary))" // Cor de seleção
              : "hsl(var(--primary))"   // Cor disponível
            : "hsl(var(--muted))",      // Cor sem dados
          stroke: "hsl(var(--background))", // Borda da cor do fundo do card
          strokeWidth: 0.5,
          outline: "none",
          transition: "all 0.3s ease",
        },
        hover: {
          fill: hasData
            ? "hsl(var(--secondary))"   // Cor de hover (secundária)
            : "hsl(var(--muted))",
          stroke: "hsl(var(--primary))", // Borda de hover (primária)
          strokeWidth: hasData ? 1.5 : 0.5,
          outline: "none",
          cursor: hasData ? "pointer" : "default",
        },
        pressed: {
          fill: "hsl(var(--secondary))",
          stroke: "hsl(var(--primary))",
          strokeWidth: 2,
          outline: "none",
        },
      }}
    />
  );
};

// Memoriza o componente para evitar re-renders desnecessários
const MemoizedCountry = memo(CountryGeography);


// --- Componente Principal ---
const WorldMap = () => {
  // --- 2. TIPO RENOMEADO NO STATE ---
  const [selectedCountry, setSelectedCountry] = useState<MusicInfo | null>(null); // Alterado de CountryMusic
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null); // Mantido para referência futura, se necessário
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- State for Artist Details Dialog ---
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [artistDetails, setArtistDetails] = useState<ArtistDetails | null>(null);
  const [isArtistLoading, setIsArtistLoading] = useState(false);
  const [artistError, setArtistError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [tracksPage, setTracksPage] = useState(1);
  const [albumsPage, setAlbumsPage] = useState(1);
  const [isTracksLoading, setIsTracksLoading] = useState(false);
  const [isAlbumsLoading, setIsAlbumsLoading] = useState(false);
  
  // YouTube Player State
  const [selectedSong, setSelectedSong] = useState<{ videoId: string; title: string } | null>(null);
  const [loadingSong, setLoadingSong] = useState<string | null>(null);

  // Cache em memória para armazenar dados já carregados
  const cacheRef = useRef<Record<string, MusicInfo>>({});

  // --- Handlers com useCallback para estabilidade referencial ---
  const handleCountryClick = useCallback(async (geo: MapGeography) => {
    const countryCode = geo.id;
    const rawName = (geo as any).properties.name;
    const countryName =
      rawName === "United States of America"
        ? "United States"
        : rawName;

    // 1. Se já existir no cache → usa imediatamente
    if (cacheRef.current[countryCode]) {
      setSelectedCountry(cacheRef.current[countryCode]);
      console.log("from cache")
      return;
    }

    // 2. Se não existir → chama API
    setSelectedCountry(null);      // Limpa estado anterior
    setIsLoading(true);            // Novo estado para loading
    setError(null);                // Limpa erros

    try {
      const data = await fetchMusicData(countryCode, countryName);
      cacheRef.current[countryCode] = data;
      setSelectedCountry(data);
      console.log(data);
    } catch (err: any) {
      let message = "Tenta novamente dentro de alguns segundos.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCountryEnter = useCallback((countryCode: string) => {
    setHoveredCountry(countryCode);
  }, []);

  const handleCountryLeave = useCallback(() => {
    setHoveredCountry(null);
  }, []);

  const handleArtistClick = async (artistName: string) => {
    setSelectedArtist(artistName);
    setIsArtistLoading(true);
    setArtistError(null);
    setArtistDetails(null);
    setTracksPage(1);
    setAlbumsPage(1);

    try {
      const details = await getArtistDetails(artistName);
      setArtistDetails(details);
    } catch (err) {
      setArtistError("Não foi possível carregar os detalhes do artista.");
    } finally {
      setIsArtistLoading(false);
    }
  };

  const handleTrackPageChange = async (newPage: number) => {
    if (!selectedArtist || !artistDetails) return;
    setIsTracksLoading(true);
    try {
      const data = await getArtistTopTracks(selectedArtist, newPage);
      setArtistDetails({ ...artistDetails, topTracks: data.toptracks });
      setTracksPage(newPage);
    } catch (error) {
      console.error("Failed to change track page", error);
    } finally {
      setIsTracksLoading(false);
    }
  };

  const handleAlbumPageChange = async (newPage: number) => {
    if (!selectedArtist || !artistDetails) return;
    setIsAlbumsLoading(true);
    try {
      const data = await getArtistTopAlbums(selectedArtist, newPage);
      setArtistDetails({ ...artistDetails, topAlbums: data.topalbums });
      setAlbumsPage(newPage);
    } catch (error) {
      console.error("Failed to change album page", error);
    } finally {
      setIsAlbumsLoading(false);
    }
  };

  const handleSearch = () => {

  };
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Explore World Music</h1>
          <p className="text-xl text-muted-foreground">
            Clique num país no mapa para descobrir a sua música
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Interactive Map Section */}
          <Card className="card-glow overflow-hidden">
            <CardContent className="p-4">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 130,
                  center: [0, 20],
                }}
                style={{
                  width: "100%",
                  height: "auto",
                }}
              >
                <ZoomableGroup center={[0, 20]} zoom={1} maxZoom={3} minZoom={1}>
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const countryCode = (geo as MapGeography).id;
                        const hasData = true;
                        const isSelected = selectedCountry?.code === countryCode;

                        // --- Loop de renderização limpo, usando o componente memorizado ---
                        return (
                          <MemoizedCountry
                            key={geo.rsmKey}
                            geo={geo as MapGeography}
                            hasData={hasData}
                            isSelected={isSelected}
                            onMouseEnter={handleCountryEnter}
                            onMouseLeave={handleCountryLeave}
                            onClick={handleCountryClick}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Search Section */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-2xl">Pesquisar Artista</CardTitle>
                <CardDescription>
                  Pesquise diretamente por um artista para ver os seus detalhes.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  placeholder="Nome do artista..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {

                  }}
                />
                <Button onClick={handleSearch}>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Pesquisar
                </Button>
              </CardContent>
            </Card>

            {isLoading ? (
              <Card className="card-glow p-10 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </Card>
            ) : error ? (
              <Card className="card-glow p-6">
                <p className="text-destructive text-lg">
                  Erro ao carregar dados: {error}
                </p>
              </Card>
            ) : selectedCountry ? (
              /* --- EXISTING UI FOR COUNTRY INFO --- */
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-3xl gradient-text">
                    {selectedCountry.country}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {selectedCountry.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* ARTISTS */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Artistas Populares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.artists.map((artist) => {
                        return (
                          <Badge
                            key={artist}
                            variant="secondary"
                            className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            onClick={() => handleArtistClick(artist)}
                          >
                            {artist}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* GENRES */}
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-secondary">
                      Géneros Musicais
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="text-base py-2 px-4">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* EMPTY STATE - ORIGINAL */
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-2xl">Selecione um País</CardTitle>
                  <CardDescription className="text-base">
                    Clique num país no mapa para explorar a sua cultura musical.
                    Países a azul têm informação disponível.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>✨ Passe o rato por cima dos países para destacá-los</p>
                    <p>🎵 Descubra artistas, géneros e factos interessantes</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

        </div>

        {/* Artist Details Dialog */}
        <Dialog open={!!selectedArtist} onOpenChange={(open) => !open && setSelectedArtist(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold gradient-text">{selectedArtist}</DialogTitle>
              <DialogDescription>
                Top músicas e álbuns mais populares no Last.fm
              </DialogDescription>
            </DialogHeader>

            {isArtistLoading ? (
              <div className="flex justify-center p-10">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : artistError ? (
              <div className="p-6 text-destructive text-center">
                {artistError}
              </div>
            ) : artistDetails ? (
              <ScrollArea className="flex-1 pr-4">
                <div className="grid md:grid-cols-2 gap-6 p-1">
                  {/* Top Tracks */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        🎵 Top Músicas
                      </h3>
                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTrackPageChange(tracksPage - 1)}
                          disabled={tracksPage === 1 || isTracksLoading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[3ch] text-center">{tracksPage}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleTrackPageChange(tracksPage + 1)}
                          disabled={isTracksLoading || (artistDetails.topTracks.track.length < 5 && tracksPage > 1)} // Simple disable logic
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {isTracksLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                      ) : (
                        artistDetails.topTracks.track.map((track: LastFmTrack, i: number) => (
                          <button
                            key={i}
                            onClick={async () => {
                              console.log('Song clicked:', track.name);
                              if (loadingSong) return;
                              setLoadingSong(track.name);
                              try {
                                console.log('Searching YouTube for:', selectedArtist, track.name);
                                let videoId = await getYouTubeVideoIdForTrack(selectedArtist!, track.name);
                                console.log('YouTube API result:', videoId);
                                
                                // If no videoId, use a special marker to show search results
                                if (!videoId) {
                                  console.log('Using YouTube search as fallback');
                                  const searchQuery = `${selectedArtist} ${track.name}`;
                                  videoId = `SEARCH:${searchQuery}`;
                                }
                                
                                console.log('Opening player with videoId:', videoId);
                                setSelectedSong({ videoId, title: track.name });
                              } catch (err) {
                                console.error('Error finding YouTube video:', err);
                              } finally {
                                setLoadingSong(null);
                              }
                            }}
                            disabled={!!loadingSong}
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            <span className="text-2xl font-bold text-muted-foreground w-8 text-center">{(tracksPage - 1) * 5 + i + 1}</span>
                            <div className="overflow-hidden flex-1 text-left">
                              <p className="font-medium truncate">{track.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {parseInt(track.listeners).toLocaleString()} ouvintes
                              </p>
                            </div>
                            {loadingSong === track.name && (
                              <span className="text-sm text-muted-foreground">Procurando...</span>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Top Albums */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-secondary flex items-center gap-2">
                        💿 Top Álbuns
                      </h3>
                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAlbumPageChange(albumsPage - 1)}
                          disabled={albumsPage === 1 || isAlbumsLoading}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium min-w-[3ch] text-center">{albumsPage}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleAlbumPageChange(albumsPage + 1)}
                          disabled={isAlbumsLoading || (artistDetails.topAlbums.album.length < 5 && albumsPage > 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {isAlbumsLoading ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                        </div>
                      ) : (
                        artistDetails.topAlbums.album.map((album: LastFmAlbum, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                            <span className="text-2xl font-bold text-muted-foreground w-8 text-center">{(albumsPage - 1) * 5 + i + 1}</span>
                            {album.image && album.image[1]["#text"] && (
                              <img
                                src={album.image[1]["#text"]}
                                alt={album.name}
                                className="w-12 h-12 rounded object-cover"
                              />
                            )}
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{album.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {album.playcount ? parseInt(album.playcount.toString()).toLocaleString() + " plays" : ""}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* YouTube Player Dialog */}
        {selectedSong && (
          <YouTubePlayer
            isOpen={!!selectedSong}
            onClose={() => setSelectedSong(null)}
            videoId={selectedSong.videoId}
            title={selectedSong.title}
          />
        )}
      </div>
    </div>
  );
};

// --- 3. COMPONENTE DE TESTE ADICIONADO AQUI ---
/**
 * Componente de teste para a API do MusicBrainz
 */
const TestApiButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MusicInfo | null>(null);

  const handleTestClick = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      // --- Vamos testar com "Portugal" (PRT) ---
      const result = await fetchMusicData("PRT", "Portugal");
      setData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="p-4 border-2 border-dashed rounded-lg my-8">
      <h3 className="text-lg font-semibold mb-2">Painel de Teste da API</h3>
      <button
        onClick={handleTestClick}
        disabled={isLoading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            A testar...
          </>
        ) : (
          "Testar API (Buscar 'Portugal')"
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-md">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {data && (
        <div className="mt-4">
          <h4 className="font-semibold">Resultado (JSON):</h4>
          <pre className="p-3 mt-2 bg-muted rounded-md text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default WorldMap;