import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Music, Search, Loader2, Disc, Info } from "lucide-react";
import { fetchNewReleases, Release } from "@/lib/api/musicBrainz";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SortOption = "date-desc" | "date-asc" | "title-asc" | "artist-asc";

const Releases = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
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

  const filteredAndSortedReleases = useMemo(() => {
    let result = releases.filter(release => {
      const matchesSearch = release.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        release.artist.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genreFilter === "all" || release.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });

    return result.sort((a, b) => {
      switch (sortOption) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc":
          return a.album.localeCompare(b.album);
        case "artist-asc":
          return a.artist.localeCompare(b.artist);
        default:
          return 0;
      }
    });
  }, [releases, searchQuery, genreFilter, sortOption]);

  const genres = useMemo(() => ["all", ...Array.from(new Set(releases.map(r => r.genre))).sort()], [releases]);

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Novos Lançamentos</h1>
          <p className="text-xl text-muted-foreground">
            Os álbuns mais recentes e populares do mundo da música
          </p>
        </div>

        <div className="mb-8 max-w-5xl mx-auto space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Pesquisar..."
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

            <Select value={sortOption} onValueChange={(val) => setSortOption(val as SortOption)}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Mais Recentes</SelectItem>
                <SelectItem value="date-asc">Mais Antigos</SelectItem>
                <SelectItem value="title-asc">Álbum (A-Z)</SelectItem>
                <SelectItem value="artist-asc">Artista (A-Z)</SelectItem>
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
            {filteredAndSortedReleases.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-xl text-muted-foreground">Sem lançamentos disponíveis</p>
              </div>
            ) : (
              filteredAndSortedReleases.map((release, index) => (
                <Card key={index} className="card-glow overflow-hidden group flex flex-col h-full">
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
                    <div className="absolute top-2 right-2 flex gap-2">
                      {release.trackCount && (
                        <Badge variant="secondary" className="backdrop-blur-md bg-black/50 text-white border-none flex items-center gap-1">
                          <Disc className="w-3 h-3" />
                          {release.trackCount}
                        </Badge>
                      )}
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
                      {release.artistLink ? (
                        <a href={release.artistLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                          {release.artist}
                        </a>
                      ) : (
                        release.artist
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(release.date).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{release.genre}</Badge>
                      </div>

                      {release.copyright && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs text-muted-foreground truncate cursor-help opacity-70 hover:opacity-100 transition-opacity">
                                {release.copyright}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-xs">{release.copyright}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
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
