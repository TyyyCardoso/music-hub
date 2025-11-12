import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { artistsData } from "@/data/artistsData";
import YouTubePlayer from "@/components/YouTubePlayer";
import { ArrowLeft, Calendar, MapPin, Music, Lightbulb, Disc3, Clock } from "lucide-react";

const ArtistProfile = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const artist = artistId ? artistsData[artistId] : null;
  const [selectedSong, setSelectedSong] = useState<{ videoId: string; title: string } | null>(null);

  if (!artist) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Artista não encontrado</h1>
          <Link to="/world-map">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Mapa
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link to="/world-map">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <Card className="card-glow lg:col-span-1">
            <CardContent className="p-6">
              <img
                src={artist.imageUrl}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
              <h1 className="text-4xl font-bold mb-2 gradient-text">{artist.name}</h1>
              <p className="text-muted-foreground">{artist.bio}</p>
            </CardContent>
          </Card>

          {/* Top Songs */}
          <Card className="card-glow lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                Top Songs
              </CardTitle>
              <CardDescription>Clique numa música para ouvir no YouTube</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {artist.topSongs.map((song, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSong({ videoId: song.youtubeId, title: song.title })}
                    className="w-full text-left p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all flex items-center justify-between group"
                  >
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">
                        {index + 1}. {song.title}
                      </p>
                      {song.album && (
                        <p className="text-sm text-muted-foreground">{song.album}</p>
                      )}
                    </div>
                    <Music className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Fun Facts */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-accent" />
                Fun Facts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {artist.funFacts.map((fact, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-accent font-bold">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Albums */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Disc3 className="h-5 w-5 text-secondary" />
                Álbuns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {artist.albums.map((album, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg bg-secondary/30"
                  >
                    <span className="font-medium">{album.title}</span>
                    <Badge variant="outline">{album.year}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tours */}
          {artist.upcomingTours.length > 0 && (
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Próximas Tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {artist.upcomingTours.map((tour, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <p className="font-semibold">{tour.venue}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{tour.city}, {tour.country}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(tour.date).toLocaleDateString('pt-PT')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Release */}
          {artist.nextRelease && (
            <Card className="card-glow border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Próximo Lançamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold gradient-text">{artist.nextRelease.title}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{artist.nextRelease.type}</Badge>
                    <span className="text-muted-foreground">
                      {new Date(artist.nextRelease.date).toLocaleDateString('pt-PT')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
  );
};

export default ArtistProfile;
