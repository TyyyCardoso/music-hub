import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, SkipForward, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Song {
  title: string;
  artist: string;
  options: string[];
  correctAnswer: string;
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

const Game = () => {
  const [currentSong, setCurrentSong] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    if (answered) return;
    
    setSelectedAnswer(answer);
    setAnswered(true);

    if (answer === songs[currentSong].correctAnswer) {
      setScore(score + 1);
      toast.success("Correct! 🎉", {
        description: `That's ${songs[currentSong].title} by ${songs[currentSong].artist}`,
      });
    } else {
      toast.error("Wrong answer!", {
        description: `The correct answer was ${songs[currentSong].correctAnswer}`,
      });
    }
  };

  const nextSong = () => {
    if (currentSong < songs.length - 1) {
      setCurrentSong(currentSong + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    } else {
      toast.success(`Game Over! Your score: ${score}/${songs.length}`, {
        description: "Thanks for playing!",
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
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Guess the Music</h1>
          <p className="text-xl text-muted-foreground">
            Test your music knowledge!
          </p>
        </div>

        {!gameStarted ? (
          <Card className="card-glow">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Ready to Play?</CardTitle>
              <CardDescription className="text-lg">
                Identify the artist for each song title. Let's see how many you can get right!
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                size="lg"
                onClick={() => setGameStarted(true)}
                className="text-lg px-8 py-6"
              >
                <Play className="mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-xl">
                <Trophy className="text-accent" />
                <span className="font-bold">Score: {score}/{songs.length}</span>
              </div>
              <span className="text-muted-foreground">
                Question {currentSong + 1} of {songs.length}
              </span>
            </div>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-3xl gradient-text text-center">
                  {songs[currentSong].title}
                </CardTitle>
                <CardDescription className="text-center text-lg">
                  Who is the artist?
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
                        Next Song
                      </>
                    ) : (
                      <>
                        <Trophy className="mr-2" />
                        Finish Game
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Game;
