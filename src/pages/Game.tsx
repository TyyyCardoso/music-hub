import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, Trophy, Music, Type, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MiniPlayer from "@/components/ui/miniplayer";
import { fetchRandomPopularTrack } from '@/lib/api/musicBrainz';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";

interface Song {
  title: string;
  artist: string;
  titleOptions: string[];
  artistOptions: string[];
  correctAnswer: string;
  correctArtist: string;
}

type GameMode = "name" | "sound" | null;

const Game = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(true);
  const [showFinishedPopup, setShowFinishedPopup] = useState(false);


  const pickRandom = <T,>(arr: T[], n: number) => {
    const clone = [...arr];
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone.slice(0, n);
  };

  const loadSongs = async () => {
    try {
      setLoadingSongs(true);
      const count = 10; // nº de perguntas
      const final: Song[] = [];
      const usedTitles = new Set<string>(); // para não repetir músicas no questionário

      while (final.length < count) {
        const options: { title: string; artist: string }[] = [];
        const artistsSet = new Set<string>();

        // tenta criar 4 opções únicas de artistas/músicas para esta pergunta
        while (options.length < 4) {
          const track = await fetchRandomPopularTrack();
          if (!track?.title || !track?.artist) continue;
          const title = track.title.trim();
          const artist = track.artist.trim();

          if (usedTitles.has(title)) continue; // já usada no questionário
          if (artistsSet.has(artist)) continue; // já usada nesta pergunta

          options.push({ title, artist });
          artistsSet.add(artist);
        }

        // seleciona aleatoriamente a resposta correta
        const correctIndex = Math.floor(Math.random() * 4);
        const correctSong = options[correctIndex];

        // adiciona música ao set global de títulos usados
        usedTitles.add(correctSong.title);

        final.push({
          title: correctSong.title,
          artist: correctSong.artist,
          titleOptions: options.map(o => o.title),
          artistOptions: options.map(o => o.artist),
          correctAnswer: correctSong.title,
          correctArtist: correctSong.artist,
        });
      }

      setSongs(final);
    } catch (err) {
      console.error("Erro ao carregar músicas", err);
    } finally {
      setLoadingSongs(false);
    }
  };




  useEffect(() => {
    loadSongs();
  }, []);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    setSelectedAnswer(answer);
    setAnswered(true);

    const correct = gameMode === "sound"
      ? songs[currentSong].correctAnswer
      : songs[currentSong].correctArtist;

    if (answer === correct) {
      setScore(score + 1);
      toast.success("Correto! 🎉", {
        description: gameMode === "sound"
          ? `A música correta era "${songs[currentSong].correctAnswer}"`
          : `O artista correto era "${songs[currentSong].artist}"`,
      });
    } else {
      toast.error("Resposta errada!", {
        description: gameMode === "sound"
          ? `A música correta era "${songs[currentSong].correctAnswer}"`
          : `O artista correto era "${songs[currentSong].artist}"`,
      });
    }
  };

  const nextSong = () => {
    if (currentSong < songs.length - 1) {
      setCurrentSong(currentSong + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      /*toast.success(`Jogo terminado! Pontuação: ${score}/${songs.length}`, {
        description: "Obrigado por jogar!",
      });
      resetGame();*/
      setShowFinishedPopup(true);
    }
  };

  const resetGame = () => {
    setCurrentSong(0);
    setScore(0);
    setGameStarted(false);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameMode(null);
    loadSongs();
  };

  const resetCurrentRun = () => {
    setCurrentSong(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    loadSongs();
  };


  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameStarted(true);
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 gradient-text">Adivinhe a Música</h1>
            <p className="text-xl text-muted-foreground">Teste o seu conhecimento musical!</p>
          </div>

          {!gameMode ? (
            <Card className="card-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Escolha o Modo de Jogo</CardTitle>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-4">
                {/* Modo Nome */}
                <Card
                  className="border-2 hover:border-primary transition-colors cursor-pointer"
                  onClick={() => !loadingSongs && startGame("name")}
                >
                  <CardHeader className="text-center">
                    <Type className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl">Modo Nome</CardTitle>
                    <CardDescription>Veja o nome da música e adivinhe o artista</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button size="lg" className="w-full">Jogar</Button>
                  </CardContent>
                </Card>

                {/* Modo Som */}
                <Card
                  className="border-2 hover:border-secondary transition-colors cursor-pointer"
                  onClick={() => !loadingSongs && startGame("sound")}
                >
                  <CardHeader className="text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <CardTitle className="text-2xl">Modo Som</CardTitle>
                    <CardDescription>Ouça a música e adivinhe o nome</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button size="lg" variant="secondary" className="w-full">Jogar</Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Pronto para Jogar?</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button
                  size="lg"
                  onClick={() => !loadingSongs && setGameStarted(true)}
                  disabled={loadingSongs}
                >
                  <Play className="mr-2" />
                  {loadingSongs ? 'A carregar...' : 'Começar Jogo'}
                </Button>

                <Button size="lg" variant="outline" onClick={() => setGameMode(null)}>Voltar</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  /* ---------------- JOGO EM PROGRESSO ---------------- */
  return (
    <>
      <Dialog open={showFinishedPopup} onOpenChange={setShowFinishedPopup}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex flex-col items-center gap-2">
              <Trophy className="w-10 h-10 text-yellow-500" />
              Jogo Terminado!
            </DialogTitle>

            <DialogDescription className="text-xl mt-2">
              A sua pontuação foi:
            </DialogDescription>

            <p className="text-4xl font-bold mt-4 mb-6">
              {score} / {songs.length}
            </p>
          </DialogHeader>

          <DialogFooter className="flex justify-center gap-4">
            <Button onClick={() => { setShowFinishedPopup(false); resetCurrentRun(); }} size="lg">
              Jogar Novamente
            </Button>

            <Button variant="outline" size="lg" onClick={() => { setShowFinishedPopup(false); resetGame(); }}>
              Voltar ao Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Adivinhe a Música</h1>
          <p className="text-xl text-muted-foreground">
            Modo: {gameMode === "name" ? "Nome" : "Som"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          {/* Back button */}
          <Button variant="ghost" size="sm" onClick={resetGame}>
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          {/* NEW Reset button */}
          <Button variant="outline" size="sm" onClick={resetCurrentRun}>
            Reiniciar
          </Button>
          {/* Score info */}
          <div className="flex items-center gap-2 text-xl">
            <Trophy className="text-accent" />
            <span className="font-bold">
              Pontuação: {score}/{songs.length}
            </span>
          </div>

          <span className="text-muted-foreground">
            Pergunta {currentSong + 1} de {songs.length}
          </span>
        </div>


        <Card className="card-glow">
          <CardHeader className="text-center">

            <CardTitle className="text-3xl gradient-text mb-4">
              {gameMode === "sound"
                ? `♫ Ouça e adivinhe o nome ♫`
                : songs[currentSong].title}
            </CardTitle>

            {/* Player no modo sound */}
            {gameMode === "sound" && (
                <MiniPlayer songTitle={songs[currentSong].title} />
            )}

            <CardDescription className="text-lg">
              {gameMode === "sound" ? "Qual é o nome da música?" : "Quem é o artista?"}
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-4">
            {(gameMode === "sound" ? songs[currentSong].titleOptions : songs[currentSong].artistOptions).map((option) => (
              <Button
                key={option}
                variant={
                  answered
                    ? option === (gameMode === "sound"
                        ? songs[currentSong].correctAnswer
                        : songs[currentSong].correctArtist)
                      ? "default"
                      : option === selectedAnswer
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
                className="w-full text-lg py-6"
                onClick={() => handleAnswer(option)}
                disabled={answered}
              >
                {option}
              </Button>
            ))}

            {answered && (
              <Button onClick={nextSong} size="lg" className="w-full mt-6">
                {currentSong < songs.length - 1
                  ? (<><SkipForward className="mr-2" /> Próxima Música</>)
                  : (<><Trophy className="mr-2" /> Terminar Jogo</>)}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
};

export default Game;
