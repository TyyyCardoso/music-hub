import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Music } from "lucide-react";

interface Release {
  artist: string;
  album: string;
  date: string;
  genre: string;
  type: "Album" | "Single" | "EP";
}

const upcomingReleases: Release[] = [
  {
    artist: "The Weeknd",
    album: "After Hours Deluxe",
    date: "2025-12-15",
    genre: "R&B",
    type: "Album",
  },
  {
    artist: "Dua Lipa",
    album: "Midnight Dreams",
    date: "2025-12-20",
    genre: "Pop",
    type: "Single",
  },
  {
    artist: "Bad Bunny",
    album: "Verano Sin Ti 2",
    date: "2025-12-22",
    genre: "Reggaeton",
    type: "Album",
  },
  {
    artist: "Billie Eilish",
    album: "What Was I Made For? (Remix)",
    date: "2025-12-25",
    genre: "Alternative",
    type: "Single",
  },
  {
    artist: "Drake",
    album: "For All The Dogs Deluxe",
    date: "2025-12-28",
    genre: "Hip Hop",
    type: "EP",
  },
  {
    artist: "Taylor Swift",
    album: "Midnights (3am Edition)",
    date: "2025-12-30",
    genre: "Pop",
    type: "Album",
  },
];

const Releases = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Upcoming Releases</h1>
          <p className="text-xl text-muted-foreground">
            Don't miss these highly anticipated music releases
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingReleases.map((release, index) => (
            <Card key={index} className="card-glow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Music className="text-primary w-8 h-8" />
                  <Badge variant="secondary">{release.type}</Badge>
                </div>
                <CardTitle className="text-2xl gradient-text">
                  {release.album}
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-foreground">
                  {release.artist}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(release.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <Badge variant="outline">{release.genre}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Releases;
