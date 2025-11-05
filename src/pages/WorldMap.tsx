import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { musicDataByCountry, CountryMusic } from "@/data/musicData";
import { Lightbulb } from "lucide-react";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryMusic | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleCountryClick = (geo: any) => {
    const countryCode = geo.id;
    const countryData = musicDataByCountry[countryCode];
    
    if (countryData) {
      setSelectedCountry(countryData);
    }
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
                        const countryCode = geo.id;
                        const hasData = !!musicDataByCountry[countryCode];
                        const isHovered = hoveredCountry === countryCode;
                        const isSelected = selectedCountry?.code === countryCode;

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => {
                              if (hasData) setHoveredCountry(countryCode);
                            }}
                            onMouseLeave={() => {
                              setHoveredCountry(null);
                            }}
                            onClick={() => handleCountryClick(geo)}
                            style={{
                              default: {
                                fill: hasData
                                  ? isSelected
                                    ? "hsl(330 85% 60%)"
                                    : "hsl(210 80% 55%)"
                                  : "hsl(220 20% 25%)",
                                stroke: "hsl(220 30% 8%)",
                                strokeWidth: 0.5,
                                outline: "none",
                                transition: "all 0.3s ease",
                              },
                              hover: {
                                fill: hasData
                                  ? "hsl(330 85% 70%)"
                                  : "hsl(220 20% 25%)",
                                stroke: "hsl(330 85% 60%)",
                                strokeWidth: hasData ? 1.5 : 0.5,
                                outline: "none",
                                cursor: hasData ? "pointer" : "default",
                              },
                              pressed: {
                                fill: "hsl(330 85% 60%)",
                                stroke: "hsl(330 85% 60%)",
                                strokeWidth: 2,
                                outline: "none",
                              },
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>
              <div className="text-center mt-4 text-sm text-muted-foreground">
                <p>Países a azul têm informação disponível • Clique para explorar</p>
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            {selectedCountry ? (
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
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Artistas Populares
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.artists.map((artist) => (
                        <Badge key={artist} variant="secondary" className="text-base py-2 px-4">
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>

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

                  {selectedCountry.funFact && (
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-accent mb-1">Fun Fact</h4>
                          <p className="text-sm text-foreground/90">{selectedCountry.funFact}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
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
                    <p>🌍 {Object.keys(musicDataByCountry).length} países disponíveis</p>
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

export default WorldMap;
