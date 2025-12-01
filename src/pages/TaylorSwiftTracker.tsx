// Updated TaylorSwiftTracker component using JSON data
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Fuel, MapPin, TrendingUp, Calendar } from "lucide-react";
import voos from "../assets/tailor_voos.json";
import { useState } from "react";
import WorldMapCanvas from "@/components/WorldMapCanvas";
import FuelCo2ComparisonChart from "@/components/FuelCo2ComparisonChart";

const TaylorSwiftTracker = () => {
  // JSON data
  const voosData = voos;

  // Sort by date (latest first)
  const parseDate = (d) =>new Date(d.replace(/(\d{1,2}) (\w+) (\d{4})/, "$2 $1, $3")).getTime();
  const sortedFlights = [...voosData].sort((a, b) => parseDate(b.date) - parseDate(a.date));

  // Most recent flight
  const latest = sortedFlights[0];

  // Aggregate stats for 2025
  const totalFlights2025 = voosData.length;
  const totalFuelUsed = voosData.reduce((sum, f) => sum + f.fuel.gallons, 0).toLocaleString();
  const totalCO2 = voosData.reduce((sum, f) => sum + f.fuel.co2_tons, 0).toLocaleString();

  return (
    <div className="min-h-screen pt-24 pb-15">
      <div className="container mx-auto px-5">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-2 gradient-text p-3">✈️ Taylor Swift Jet Tracker</h1>
          <p className="text-xl text-muted-foreground">Acompanhe o consumo de combustível e emissões do avião privado</p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">

          {/* Most Recent Flight */}
          <Card className="card-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl gradient-text">Status Atual do Voo</CardTitle>
                  <CardDescription className="text-lg mt-2">Informação do último voo registrado</CardDescription>
                </div>
                <Badge variant="default" className="text-lg py-2 px-4">
                  <Plane className="mr-2 w-5 h-5" /> Em Solo
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Último Local</p>
                    <p className="text-xl font-semibold">{latest.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-6 h-6 text-accent mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="text-xl font-semibold">{latest.date}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="w-6 h-6 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração do Voo</p>
                    <p className="text-xl font-semibold">{latest.flight_time}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <Fuel className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Combustível</p>
                    <p className="text-2xl font-bold text-orange-500">{latest.fuel.gallons} gal</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 text-red-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Emissões CO₂</p>
                    <p className="text-2xl font-bold text-red-500">{latest.fuel.co2_tons} tons</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Plane className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Registo do Avião</p>
                    <p className="text-2xl font-bold text-green-500">{latest.reg}</p>
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
                  <p className="text-3xl font-bold text-primary mb-1">{}</p>
                  <p className="text-sm text-muted-foreground">Total de Voos</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-6 text-center">
                  <Fuel className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-500 mb-1">{}</p>
                  <p className="text-sm text-muted-foreground">Combustível Total</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-red-500 mb-1">{ }</p>
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
          <p className="text-center text-sm text-muted-foreground"> </p>

        </div>
      </div>
    </div>
  );
};

export default TaylorSwiftTracker;
