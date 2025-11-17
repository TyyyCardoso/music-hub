import { useState, useCallback, memo, useRef} from "react";
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
import { Lightbulb, Loader2 } from "lucide-react"; // Adicionado Loader2
import { fetchMusicData } from "@/lib/api/musicBrainz"; // Ajusta este caminho se necessário

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
    } catch (err:any) {
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
                        const artistId = artist.toLowerCase().replace(/\s+/g, "-");
                        return (
                          <Link key={artist} to={`/artist/${artistId}`}>
                            <Badge
                              variant="secondary"
                              className="text-base py-2 px-4 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {artist}
                            </Badge>
                          </Link>
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