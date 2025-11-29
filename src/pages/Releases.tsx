import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Music, Search, Loader2 } from "lucide-react";
import { fetchNewReleases, Release } from "@/lib/api/musicBrainz";

const Releases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReleases = async () => {
      setLoading(true);
      const data = await fetchNewReleases();
      setReleases(data);
      setLoading(false);
    };
    loadReleases();
  }, []);

  const filteredReleases = releases.filter(release => {
    const matchesSearch = release.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      release.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === "all" || release.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const genres = ["all", ...Array.from(new Set(releases.map(r => r.genre)))];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Novos Lançamentos</h1>
          <p className="text-xl text-muted-foreground">
            Os álbuns mais recentes e populares do mundo da música
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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReleases.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">Sem lançamentos disponíveis</p>
              </div>
            ) : (
              filteredReleases.map((release, index) => (
                <Card key={index} className="card-glow overflow-hidden group">
                  <div className="relative aspect-square w-full overflow-hidden">
                    {release.imageUrl ? (
                      <img
                        src={release.imageUrl}
                        alt={release.album}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Music className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-none">
                        {release.type}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl gradient-text line-clamp-1" title={release.album}>
                      {release.link ? (
                        <a href={release.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {release.album}
                        </a>
                      ) : (
                        release.album
                      )}
                    </CardTitle>
                    <CardDescription className="text-lg font-semibold text-foreground line-clamp-1" title={release.artist}>
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
        )}
      </div>
    </div>
  );
};

export default Releases;
