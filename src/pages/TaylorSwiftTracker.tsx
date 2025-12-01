import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Fuel, MapPin, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import WorldMapCanvas from "@/components/WorldMapCanvas";
import FuelCo2ComparisonChart from "@/components/FuelCo2ComparisonChart";

const TaylorSwiftTracker = () => {
  // Mock data - numa aplicação real, estes dados viriam de uma API
  const flightData = {
    currentLocation: "Los Angeles, CA",
    nextDestination: "Tokyo, Japan",
    estimatedFuel: "12,450 gallons",
    co2Emissions: "118 tons",
    flightDistance: "5,478 miles",
    departureDate: "15 Nov 2025",
    totalFlights2025: 42,
    totalFuelUsed: "523,800 gallons",
    totalCO2: "4,956 tons",
  };

  const recentFlights = [
    { from: "New York", to: "Los Angeles", date: "10 Nov 2025", fuel: "11,200 gal", co2: "106 tons" },
    { from: "London", to: "New York", date: "5 Nov 2025", fuel: "15,800 gal", co2: "150 tons" },
    { from: "Paris", to: "London", date: "1 Nov 2025", fuel: "3,200 gal", co2: "30 tons" },
    { from: "Berlin", to: "Paris", date: "28 Oct 2025", fuel: "2,800 gal", co2: "26 tons" },
  ];

  const [expandedFlightIndex, setExpandedFlightIndex] = useState<number | null>(null);

  function parseFlightValues(flight: { fuel: string; co2: string }) {
    const fuel = Number(flight.fuel.replace(/[^0-9.-]+/g, ""));
    const co2 = Number(flight.co2.replace(/[^0-9.-]+/g, ""));
    return { fuel: isNaN(fuel) ? 0 : fuel, co2: isNaN(co2) ? 0 : co2 };
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">
            ✈️ Taylor Swift Jet Tracker
          </h1>
          <p className="text-xl text-muted-foreground">
            Acompanhe o consumo de combustível e emissões do avião privado
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Current Flight Status */}
          <Card className="card-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl gradient-text">Status Atual do Voo</CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Informação do próximo voo programado
                  </CardDescription>
                </div>
                <Badge variant="default" className="text-lg py-2 px-4">
                  <Plane className="mr-2 w-5 h-5" />
                  Em Solo
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localização Atual</p>
                    <p className="text-xl font-semibold">{flightData.currentLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-secondary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Próximo Destino</p>
                    <p className="text-xl font-semibold">{flightData.nextDestination}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Partida</p>
                    <p className="text-xl font-semibold">{flightData.departureDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Fuel className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Combustível Estimado</p>
                    <p className="text-2xl font-bold text-orange-500">{flightData.estimatedFuel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Emissões CO₂</p>
                    <p className="text-2xl font-bold text-red-500">{flightData.co2Emissions}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Plane className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Distância do Voo</p>
                    <p className="text-2xl font-bold text-blue-500">{flightData.flightDistance}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2025 Statistics */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Estatísticas de 2025</CardTitle>
              <CardDescription>Totais acumulados este ano</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-primary/10 rounded-lg p-6 text-center">
                  <Plane className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-primary mb-1">{flightData.totalFlights2025}</p>
                  <p className="text-sm text-muted-foreground">Total de Voos</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-6 text-center">
                  <Fuel className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-500 mb-1">{flightData.totalFuelUsed}</p>
                  <p className="text-sm text-muted-foreground">Combustível Total</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-red-500 mb-1">{flightData.totalCO2}</p>
                  <p className="text-sm text-muted-foreground">Emissões CO₂ Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Flights */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-2xl">Voos Recentes</CardTitle>
              <CardDescription>Histórico dos últimos voos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFlights.map((flight, index) => (
                  <div key={index} className="space-y-2">
                    <button
                      className="w-full flex items-center justify-between p-4 bg-card/50 rounded-lg border"
                      onClick={() => setExpandedFlightIndex(expandedFlightIndex === index ? null : index)}
                      aria-expanded={expandedFlightIndex === index}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Plane className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-semibold">
                            {flight.from} → {flight.to}
                          </p>
                          <p className="text-sm text-muted-foreground">{flight.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 text-sm">
                        <div className="text-right">
                          <p className="text-orange-500 font-semibold">{flight.fuel}</p>
                          <p className="text-muted-foreground">Combustível</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-500 font-semibold">{flight.co2}</p>
                          <p className="text-muted-foreground">CO₂</p>
                        </div>
                      </div>
                    </button>

                    {expandedFlightIndex === index && (
                      <div className="p-4 bg-card/40 rounded-lg border mt-1">
                        <div className="grid md:grid-cols-2 gap-4 items-center">
                          <div className="w-full h-64 rounded overflow-hidden border">
                            {/* Map from the world map canvas (reuses projection/style) */}
                            <WorldMapCanvas
                              markers={(() => {
                                const cityCoords: Record<string, [number, number]> = {
                                  'New York': [-74.0060, 40.7128],
                                  'Los Angeles': [-118.2437, 34.0522],
                                  'London': [-0.1278, 51.5074],
                                  'Paris': [2.3522, 48.8566],
                                  'Berlin': [13.4050, 52.5200],
                                  'Tokyo': [139.6917, 35.6895],
                                };
                                const from = cityCoords[flight.from as keyof typeof cityCoords];
                                const to = cityCoords[flight.to as keyof typeof cityCoords];
                                const markers = [] as any[];
                                if (from) markers.push({ coordinates: from, label: flight.from });
                                if (to) markers.push({ coordinates: to, label: flight.to, color: '#fb7185' });
                                return markers;
                              })()}
                              routes={(() => {
                                const cityCoords: Record<string, [number, number]> = {
                                  'New York': [-74.0060, 40.7128],
                                  'Los Angeles': [-118.2437, 34.0522],
                                  'London': [-0.1278, 51.5074],
                                  'Paris': [2.3522, 48.8566],
                                  'Berlin': [13.4050, 52.5200],
                                  'Tokyo': [139.6917, 35.6895],
                                };
                                const from = cityCoords[flight.from as keyof typeof cityCoords];
                                const to = cityCoords[flight.to as keyof typeof cityCoords];
                                if (from && to) return [{ from, to, color: '#60a5fa' }];
                                return [];
                              })()}
                              focusRoute={(() => {
                                const cityCoords: Record<string, [number, number]> = {
                                  'New York': [-74.0060, 40.7128],
                                  'Los Angeles': [-118.2437, 34.0522],
                                  'London': [-0.1278, 51.5074],
                                  'Paris': [2.3522, 48.8566],
                                  'Berlin': [13.4050, 52.5200],
                                  'Tokyo': [139.6917, 35.6895],
                                };
                                const from = cityCoords[flight.from as keyof typeof cityCoords];
                                const to = cityCoords[flight.to as keyof typeof cityCoords];
                                if (from && to) return { from, to, zoom: 2 };
                                return null;
                              })()}
                              interactive={false}
                            />
                          </div>
                          <div className="w-full p-2">
                                        {(() => {
                                          // Build sorted flights by date descending so we can pick the most recent flight
                                          const sortedFlights = [...recentFlights].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                                          const sortedIndex = sortedFlights.findIndex(f => f.from === flight.from && f.to === flight.to && f.date === flight.date);
                                          // For sorted descending (most recent first), the previous (older) flight is at sortedIndex + 1
                                          const previousFlight = sortedIndex !== -1 && sortedIndex < sortedFlights.length - 1 ? sortedFlights[sortedIndex + 1] : null;

                                          if (!previousFlight) {
                                            return <div className="text-sm text-muted-foreground">Não há voo anterior para comparar.</div>;
                                          }

                                          return (
                                            <FuelCo2ComparisonChart
                                              previous={parseFlightValues(previousFlight)}
                                              current={parseFlightValues(flight)}
                                              previousLabel={`Previous: ${previousFlight!.from} → ${previousFlight!.to}`}
                                              currentLabel={`Selected: ${flight.from} → ${flight.to}`}
                                            />
                                          );
                                        })()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact Note */}
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center">
                ⚠️ <strong>Nota:</strong> Este é um tracker educacional com dados simulados. Para comparação, 
                a pessoa média emite cerca de 4 toneladas de CO₂ por ano. Os valores mostrados demonstram 
                o impacto ambiental significativo das viagens em aviões privados.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaylorSwiftTracker;
