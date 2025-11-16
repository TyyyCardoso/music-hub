import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, Trophy, Music, Type, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import MiniPlayer from "@/components/ui/miniplayer";


interface Song {
  title: string;
  artist: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
}

const songs: Song[] = [
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    options: ["Drake", "The Weeknd", "Post Malone", "Ed Sheeran"],
    correctAnswer: "The Weeknd",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    options: ["Justin Bieber", "Ed Sheeran", "Shawn Mendes", "Charlie Puth"],
    correctAnswer: "Ed Sheeran",
  },
  {
    title: "Rolling in the Deep",
    artist: "Adele",
    options: ["Taylor Swift", "Beyoncé", "Adele", "Ariana Grande"],
    correctAnswer: "Adele",
  },
  {
    title: "Levitating",
    artist: "Dua Lipa",
    options: ["Dua Lipa", "Olivia Rodrigo", "Billie Eilish", "Doja Cat"],
    correctAnswer: "Dua Lipa",
  },
  {
    title: "Bad Guy",
    artist: "Billie Eilish",
    options: ["Billie Eilish", "Halsey", "Lorde", "Lana Del Rey"],
    correctAnswer: "Billie Eilish",
  },
];

type GameMode = "name" | "sound" | null;

const Game = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === songs[currentSong].correctAnswer) {
      setScore(score + 1);
      toast.success("Correto! 🎉", {
        description: `É ${songs[currentSong].title} de ${songs[currentSong].artist}`,
      });
    } else {
      toast.error("Resposta errada!", {
        description: `A resposta correta era ${songs[currentSong].correctAnswer}`,
      });
    }
  };

  const nextSong = () => {
    if (currentSong < songs.length - 1) {
      setCurrentSong(currentSong + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      toast.success(`Jogo terminado! Pontuação: ${score}/${songs.length}`, {
        description: "Obrigado por jogar!",
      });
      resetGame();
    }
  };

  const resetGame = () => {
    setCurrentSong(0);
    setScore(0);
    setGameStarted(false);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameMode(null);
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
            <p className="text-xl text-muted-foreground">
              Teste o seu conhecimento musical!
            </p>
          </div>

          {!gameMode ? (
            <Card className="card-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Escolha o Modo de Jogo</CardTitle>
                <CardDescription className="text-lg">
                  Selecione como quer jogar
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={() => startGame("name")}>
                  <CardHeader className="text-center">
                    <Type className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-2xl">Modo Nome</CardTitle>
                    <CardDescription>
                      Veja o nome da música e adivinhe o artista
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button size="lg" className="w-full">
                      Jogar
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-secondary transition-colors cursor-pointer" onClick={() => startGame("sound")}>
                  <CardHeader className="text-center">
                    <Music className="w-12 h-12 mx-auto mb-4 text-secondary" />
                    <CardTitle className="text-2xl">Modo Som</CardTitle>
                    <CardDescription>
                      Ouça a música e adivinhe o artista
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <Button size="lg" variant="secondary" className="w-full">
                      Jogar
                    </Button>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          ) : (
            <Card className="card-glow">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-4">Pronto para Jogar?</CardTitle>
                <CardDescription className="text-lg">
                  Identifique o artista de cada música. Vamos ver quantas acerta!
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button
                  size="lg"
                  onClick={() => setGameStarted(true)}
                  className="text-lg px-8 py-6"
                >
                  <Play className="mr-2" />
                  Começar Jogo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setGameMode(null)}
                  className="text-lg px-8 py-6"
                >
                  Voltar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Adivinhe a Música</h1>
          <p className="text-xl text-muted-foreground">
            Modo: {gameMode === "name" ? "Nome" : "Som"}
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetGame}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>

            <div className="flex items-center gap-2 text-xl">
              <Trophy className="text-accent" />
              <span className="font-bold">Pontuação: {score}/{songs.length}</span>
            </div>
          </div>

          <span className="text-muted-foreground">
            Pergunta {currentSong + 1} de {songs.length}
          </span>
        </div>

        <Card className="card-glow">
          <CardHeader className="text-center">
          <CardTitle className="text-3xl gradient-text mb-4">
            {gameMode === "name" ? songs[currentSong].title : "♫ Ouça a música ♫"}
          </CardTitle>
            {gameMode === "sound" && (
              <div>
                <MiniPlayer songTitle={songs[currentSong].title}/>
              </div>
            )}

  <CardDescription className="text-lg">
    Quem é o artista?
  </CardDescription>
</CardHeader>

          <CardContent className="space-y-4">
            {songs[currentSong].options.map((option) => (
              <Button
                key={option}
                variant={
                  answered
                    ? option === songs[currentSong].correctAnswer
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
              <Button
                onClick={nextSong}
                size="lg"
                className="w-full mt-6"
              >
                {currentSong < songs.length - 1 ? (
                  <>
                    <SkipForward className="mr-2" />
                    Próxima Música
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2" />
                    Terminar Jogo
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;
