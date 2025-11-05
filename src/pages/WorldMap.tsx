import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import worldMapBg from "@/assets/world-map-bg.jpg";

interface CountryMusic {
  country: string;
  artists: string[];
  genres: string[];
  description: string;
}

const countryData: Record<string, CountryMusic> = {
  "United States": {
    country: "United States",
    artists: ["Taylor Swift", "Kendrick Lamar", "Billie Eilish"],
    genres: ["Pop", "Hip Hop", "Rock", "Country"],
    description: "Birthplace of jazz, blues, and hip hop. Home to diverse musical traditions.",
  },
  "United Kingdom": {
    country: "United Kingdom",
    artists: ["The Beatles", "Adele", "Ed Sheeran"],
    genres: ["Rock", "Pop", "Electronic"],
    description: "British Invasion pioneers. Leading force in rock and electronic music.",
  },
  "Brazil": {
    country: "Brazil",
    artists: ["Anitta", "Caetano Veloso", "Gilberto Gil"],
    genres: ["Bossa Nova", "Samba", "Funk Carioca"],
    description: "Rich rhythmic traditions. Bossa nova and samba influence worldwide.",
  },
  "South Korea": {
    country: "South Korea",
    artists: ["BTS", "BLACKPINK", "IU"],
    genres: ["K-Pop", "R&B", "Hip Hop"],
    description: "K-pop global phenomenon. Cutting-edge production and performance.",
  },
  "Nigeria": {
    country: "Nigeria",
    artists: ["Burna Boy", "Wizkid", "Fela Kuti"],
    genres: ["Afrobeats", "Afrobeat", "Highlife"],
    description: "Afrobeats taking the world by storm. Rich percussion traditions.",
  },
};

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countries = Object.keys(countryData);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Explore World Music</h1>
          <p className="text-xl text-muted-foreground">
            Click on a country to discover its musical heritage
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <Card className="card-glow overflow-hidden">
            <CardContent className="p-0 relative h-[500px]">
              <img
                src={worldMapBg}
                alt="World Map"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              
              {/* Interactive Country Buttons */}
              <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-4 p-8">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => setSelectedCountry(country)}
                    className="px-6 py-3 bg-primary/20 hover:bg-primary/40 backdrop-blur-md rounded-lg border border-primary/50 text-foreground font-semibold transition-all hover:scale-105"
                  >
                    {country}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Info Section */}
          <div className="space-y-6">
            {selectedCountry ? (
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-3xl gradient-text">
                    {countryData[selectedCountry].country}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {countryData[selectedCountry].description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary">
                      Popular Artists
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {countryData[selectedCountry].artists.map((artist) => (
                        <Badge key={artist} variant="secondary" className="text-base py-2 px-4">
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-secondary">
                      Music Genres
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {countryData[selectedCountry].genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="text-base py-2 px-4">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle className="text-2xl">Select a Country</CardTitle>
                  <CardDescription>
                    Choose a country from the map to explore its musical culture
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
