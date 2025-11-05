import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Music, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");

  const filteredReleases = upcomingReleases.filter(release => {
    const matchesSearch = release.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" || release.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const genres = ["all", ...Array.from(new Set(upcomingReleases.map(r => r.genre)))];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Próximos Lançamentos</h1>
          <p className="text-xl text-muted-foreground">
            Os álbuns mais esperados do mundo da música
          </p>
        </div>

        <div className="mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Pesquisar por título ou artista..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por género" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Géneros</SelectItem>
                {genres.slice(1).map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReleases.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-muted-foreground">Nenhum lançamento encontrado</p>
            </div>
          ) : (
            filteredReleases.map((release, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Releases;
