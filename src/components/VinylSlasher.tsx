import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import vinylPsychedelic from "@/assets/vinyl-psychedelic.png";
import vinylGeometric from "@/assets/vinyl-geometric.png";
import vinylRainbow from "@/assets/vinyl-rainbow.png";
import shusuiImg from '@/assets/swords/shusui.png';
import zenithImg from '@/assets/swords/zenith.png';
import samehadaImg from '@/assets/swords/Samehada.png';
import enmaImg from '@/assets/swords/enma.png';
import antumbraImg from '@/assets/swords/antumbra.png';
import albumsJSON from "@/assets/albums/albums.json";
import { AlbumCollectionDialog } from "./AlbumCollection.tsx";
import { BookOpen } from "lucide-react";


interface Album {
  album: string;
  artist: string;
  tag?: string;
  rank?: number;
  file: string;
  img?: HTMLImageElement;
}

interface Vinyl {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  radius: number;
  sliced: boolean;
  color: string;
  image?: HTMLImageElement;
  album?: Album; 
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const albumList: Album[] = albumsJSON.map(a => {
  const img = new Image();
  img.src = `/src/assets/albums/${a.file}`;
  return { ...a, img };
});




export const VinylSlasher = () => {
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [unlockedAlbums, setUnlockedAlbums] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("unlockedAlbums");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {// Persist unlocked albums
    localStorage.setItem("unlockedAlbums", JSON.stringify([...unlockedAlbums]));
  }, [unlockedAlbums]);

  const unlockAlbum = (file: string) => { // Exemplo: ao cortar um vinil, desbloqueia álbum
    setUnlockedAlbums(prev => new Set([...prev, file]));
  };


  const [cutAlbums, setCutAlbums] = useState<Album[]>([]); // State dos álbuns cortados
  const [mode, setMode] = useState<'points' | 'time' | null>(null);// Game mode: 'points' or 'time'
  // Sword selection
  const swordOptions = [
    { label: 'Shusui', value: 'shusui', img: shusuiImg },
    { label: 'Zenith', value: 'zenith', img: zenithImg },
    { label: 'Samehada', value: 'samehada', img: samehadaImg },
    { label: 'Enma', value: 'enma', img: enmaImg },
    { label: 'Antumbra', value: 'antumbra', img: antumbraImg },
  ];
  const [selectedSword, setSelectedSword] = useState<'shusui' | 'zenith' | 'samehada' | 'enma' | 'antumbra'>('shusui');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<number>(0);
  
  const vinylsRef = useRef<Vinyl[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mousePathRef = useRef<{ x: number; y: number }[]>([]);
  const animationFrameRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  const vinylColors = ['#1a1a1a', '#8b0000', '#00008b', '#006400', '#4b0082', '#8b4513'];
  const vinylImagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    const images = [vinylPsychedelic, vinylGeometric, vinylRainbow];
    vinylImagesRef.current = images.map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
  }, []);



  const spawnVinyl = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const radius = 35 + Math.random() * 30;
    const color = vinylColors[Math.floor(Math.random() * vinylColors.length)];
    
    // 10% chance de ser um álbum especial
    let image: HTMLImageElement | undefined = undefined;
    let vinylAlbum: Album | undefined = undefined;

    if (Math.random() < 0.1) {
      const chosen = albumList[Math.floor(Math.random() * albumList.length)];
      image = chosen.img;
      vinylAlbum = chosen;
    }
        
    // 20% chance to spawn from middle, 80% from sides
    const spawnType = Math.random();
    let x, y, vx, vy;
    
    if (spawnType < 0.2) {
      // Spawn from middle bottom going straight up
      x = canvas.width / 2 + (Math.random() - 0.9) * 200;
      y = canvas.height - 50;
      vx = (Math.random() - 0.5) * 1.2;
      vy = -15 - Math.random() * 5;
    } else {
      // Spawn from sides for curved trajectory
      const fromLeft = Math.random() > 0.5;
      x = fromLeft ? radius : canvas.width - radius;
      y = canvas.height - 50;
      vx = fromLeft ? 2 + Math.random() * 1 : -(2 + Math.random() * 1);
      vy = -15 - Math.random() * 5;
    }
    
    vinylsRef.current.push({
      id: Date.now() + Math.random(),
      x,
      y,
      vx,
      vy,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.15,
      radius,
      sliced: false,
      color,
      image,
      album: vinylAlbum, // <-- NOVO campo
    });

  };

  const createParticles = (x: number, y: number) => {
    const colors = ['#ff0080', '#00ffff', '#ffff00', '#ff00ff'];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI; // * 2;
      const speed = 2;// + Math.random() * 2;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  };

  const checkSlice = (vinyl: Vinyl) => {
    const path = mousePathRef.current;
    if (path.length < 2) return false;

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      
      const dx = vinyl.x - p1.x;
      const dy = vinyl.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < vinyl.radius) {
        return true;
      }
    }
    return false;
  };

  const drawVinyl = (ctx: CanvasRenderingContext2D, vinyl: Vinyl) => {
    ctx.save();
    ctx.translate(vinyl.x, vinyl.y);
    ctx.rotate(vinyl.rotation);
    
    if (vinyl.image && vinyl.image.complete) {
      // Draw vinyl with iconic image
      // Draw outer black rim
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Clip to circle for image
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius * 0.95, 0, Math.PI * 2);
      ctx.clip();
      
      // Draw the image
      ctx.drawImage(
        vinyl.image,
        -vinyl.radius * 0.95,
        -vinyl.radius * 0.95,
        vinyl.radius * 1.9,
        vinyl.radius * 1.9
      );
      
      // Reset clipping
      ctx.restore();
      ctx.save();
      ctx.translate(vinyl.x, vinyl.y);
      ctx.rotate(vinyl.rotation);
      
      // Center hole
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Draw standard vinyl
      // Outer disc with vinyl color
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, vinyl.radius);
      const baseColor = vinyl.color;
      gradient.addColorStop(0, baseColor);
      gradient.addColorStop(0.7, baseColor);
      gradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Grooves
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const r = vinyl.radius * (0.3 + i * 0.12);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Center label
      ctx.fillStyle = '#ff0080';
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius * 0.25, 0, Math.PI * 2);
      ctx.fill();
      
      // Center hole
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, vinyl.radius * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.life;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  };

  const gameLoop = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !isPlaying) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Spawn new vinyls - spawn 2-3 at intervals
    if (timestamp - lastSpawnRef.current > 800) {
      const spawnCount = Math.floor(Math.random() * 2) + 2; // 2 or 3 vinyls
      for (let i = 0; i < spawnCount; i++) {
        setTimeout(() => spawnVinyl(), i * 150); // Stagger spawns slightly
      }
      lastSpawnRef.current = timestamp;
    }

    // Update and draw vinyls
    vinylsRef.current = vinylsRef.current.filter(vinyl => {
      if (vinyl.sliced) return false;

      vinyl.vy += 0.25; // Reduced gravity for smoother arc
      vinyl.x += vinyl.vx;
      vinyl.y += vinyl.vy;
      vinyl.rotation += vinyl.rotationSpeed;

      // Check if sliced
      if (checkSlice(vinyl)) { 
        vinyl.sliced = true;
        createParticles(vinyl.x, vinyl.y);

        if (vinyl.album) {//album for cortado, guardar o álbum cortado
          unlockAlbum(vinyl.album.file);
          setCutAlbums(prev => {
            if (!prev.find(a => a.file === vinyl.album!.file)) {
              return [...prev, vinyl.album!];
            }
            return prev;
          });
        }

        setScore(s => {
          const newScore = s + 10;
          // Points mode: end at 1000 points
          if (mode === 'points' && newScore >= 1000) {
            const endTime = Date.now();
            setFinalTime(Math.floor((endTime - startTime) / 1000));
            setGameOver(true);
            setIsPlaying(false);
          }
          return newScore;
        });
        return false;
      }

      // Check if missed - lose a life but don't end game
      if (vinyl.y > canvas.height + vinyl.radius) {
        setLives(l => Math.max(0, l - 1));
        return false;
      }

      drawVinyl(ctx, vinyl);
      return true;
    });

    // Time mode: end after 60 seconds
    if (mode === 'time' && elapsedTime >= 60) {
      setGameOver(true);
      setIsPlaying(false);
      setFinalTime(60);
      // Garantir que o utilizador recebe pelo menos 1 álbum novo
      setCutAlbums(prev => {
        const gotNewAlbum = prev.some(a => !unlockedAlbums.has(a.file));

        if (!gotNewAlbum) {
          const bonus = grantGuaranteedAlbum();
          return bonus ? [...prev, bonus] : prev;
        }

        return prev;
      });

      return;
    }

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.2;
      particle.life -= 0.02;

      if (particle.life > 0) {
        drawParticle(ctx, particle);
        return true;
      }
      return false;
    });

    // Draw mouse trail
    if (mousePathRef.current.length > 1) {
      // Draw a single continuous line with fading effect
      ctx.save();
      ctx.lineWidth = 20;
      ctx.shadowBlur = 10;
      let trailColor = 'red';
      let rgbVal = '255,0,0';
      if (selectedSword === 'zenith') {
        trailColor = 'rgb(181,219,198)';
        rgbVal = '181,219,198';
      } else if (selectedSword === 'samehada') {
        trailColor = 'rgb(96,125,139)';
        rgbVal = '96,125,139';
      } else if (selectedSword === 'enma') {
        trailColor = 'rgb(255,255,255)';
        rgbVal = '255,255,255';
      } else if (selectedSword === 'antumbra') {
        trailColor = 'rgb(173,216,230)';
        rgbVal = '173,216,230';
      }
      ctx.shadowColor = trailColor;
      const len = mousePathRef.current.length;
      ctx.beginPath();
      ctx.moveTo(mousePathRef.current[0].x, mousePathRef.current[0].y);
      for (let i = 1; i < len; i++) {
        ctx.lineTo(mousePathRef.current[i].x, mousePathRef.current[i].y);
      }
      // Create gradient from cursor to tail with a strong, short fade
      const start = mousePathRef.current[0];
      const end = mousePathRef.current[len - 1];
      const grad = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
      grad.addColorStop(0, `rgba(${rgbVal},0)`);
      grad.addColorStop(0.5, `rgba(${rgbVal},0)`);
      grad.addColorStop(1, trailColor);
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mousePathRef.current.push({ x, y });
    if (mousePathRef.current.length > 10) {
      mousePathRef.current.shift();
    }
  };

  const handleMouseLeave = () => {
    mousePathRef.current = [];
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsPlaying(true);
    setStartTime(Date.now());
    setElapsedTime(0);
    setFinalTime(0);
    vinylsRef.current = [];
    particlesRef.current = [];
    mousePathRef.current = [];
    lastSpawnRef.current = 0;
    setCutAlbums([]); // Reset cut albums at game start
  };

  useEffect(() => {
  if (isPlaying) {
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    // Update elapsed time every 100ms
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => {
        const newElapsed = Math.floor((Date.now() - startTime) / 1000);
        if (mode === 'time' && newElapsed >= 60) {
          setGameOver(true);
          setIsPlaying(false);
          setFinalTime(60);

          
          setCutAlbums(prev => {// Garantir que o utilizador recebe pelo menos 1 álbum novo
            const gotNewAlbum = prev.some(a => !unlockedAlbums.has(a.file));
            if (!gotNewAlbum) {
              const bonus = grantGuaranteedAlbum();
              return bonus ? [...prev, bonus] : prev;
            }
            return prev;
          });

          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          clearInterval(timeInterval);
          return 60;
        }
        return newElapsed;
      });
    }, 100);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(timeInterval);
    };
  }
}, [isPlaying, startTime, mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Set cursor to selected sword when game starts, revert when leaving
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      if (isPlaying) {
        const swordObj = swordOptions.find(s => s.value === selectedSword);
        if (swordObj) {
          canvas.style.cursor = `url(${swordObj.img}) 24 24, auto`;
        }
      } else {
        canvas.style.cursor = 'auto';
      }
    }
    return () => {
      if (canvas) canvas.style.cursor = 'auto';
    };
  }, [isPlaying, selectedSword]);

  const grantGuaranteedAlbum = () => {
    const unlocked = unlockedAlbums;
    const lockedAlbums = albumList.filter(a => !unlocked.has(a.file));

    if (lockedAlbums.length === 0) return null; // já tem tudo

    // escolhe um álbum bloqueado aleatório
    const chosen = lockedAlbums[Math.floor(Math.random() * lockedAlbums.length)];

    // desbloqueia
    unlockAlbum(chosen.file);

    return chosen;
  };


  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-game">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="absolute inset-0 cursor-crosshair"
      />
      
      {/* HUD */}
      <div className="absolute top-8 left-0 right-0 flex justify-between px-8 pointer-events-none z-10">
        <div className="flex flex-col gap-2 mt-16">
          <div className="text-4xl font-bold text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
            {mode === 'points' ? `${score} / 1000` : `${score} pontos`}
          </div>
          <div className="text-2xl font-bold text-primary drop-shadow-[0_0_10px_hsl(var(--primary))]">
            {mode === 'time'
                ? (() => {
                    const remaining = Math.max(0, 60 - elapsedTime);
                    return `${Math.floor(remaining / 60)}:${(remaining % 60).toString().padStart(2, '0')}`;
                  })()
              : `${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}`}
          </div>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: lives }).map((_, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-primary shadow-glow"
            />
          ))}
        </div>
      </div>
      
      {/* Start/Game Over Screen */}
      {(!isPlaying || gameOver) && (
        <div>
          {/* Botão da coleção - sempre visível no menu ou game over */}
          {!isPlaying && (
            <div>
              <button onClick={() => setCollectionOpen(true)}
                className="
                  absolute top-20 left-3 z-30
                  p-3 rounded-xl
                  bg-gradient-to-br from-pink-500 to-purple-600
                  hover:from-pink-400 hover:to-purple-500
                  shadow-xl flex items-center justify-center
                "
              >
                <BookOpen className="w-8 h-8 text-white drop-shadow-lg" />
              </button>

              <AlbumCollectionDialog
                open={collectionOpen}
                onOpenChange={setCollectionOpen}
                unlockedAlbums={unlockedAlbums}
                setUnlockedAlbums={setUnlockedAlbums}
              />
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-20">
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-neon drop-shadow-[0_0_20px_hsl(var(--primary))]">
              Vinyl Slasher
            </h1>
            {/* Mode selection */}
            {!isPlaying && !mode && (
              <div className="space-y-4">
                <p className="text-2xl text-muted-foreground">Escolha o modo de jogo:</p>
                <div className="flex justify-center gap-4 items-center">
                  <Button size="lg" className="text-xl px-8 py-6" onClick={() => setMode('points')}>
                    Pontos (1000 pontos)
                  </Button>
                  <Button size="lg" className="text-xl px-8 py-6" onClick={() => setMode('time')}>
                    Tempo (1 minuto)
                  </Button>
                  <select
                    className="ml-6 px-4 py-2 rounded-lg border border-primary text-xl bg-background text-primary shadow-glow"
                    value={selectedSword}
                    onChange={e => setSelectedSword(e.target.value as 'shusui' | 'zenith' | 'samehada' | 'enma' | 'antumbra')}
                  >
                    {swordOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {/* Game Over display */}
            {gameOver && (
              <div className="space-y-2">
                {mode === 'points' ? (
                  <>
                    <p className="text-4xl text-accent font-bold">
                      Tempo: {Math.floor(finalTime / 60)}:{(finalTime % 60).toString().padStart(2, '0')}
                    </p>
                    <p className="text-2xl text-muted-foreground">
                      Você alcançou 1000 pontos!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-4xl text-accent font-bold">
                      Pontuação: {score}
                    </p>
                    <p className="text-2xl text-muted-foreground">
                      1 minuto acabou!
                    </p>
                  </>
                )}
              </div>
            )}
            {/* Start button */}
            {!gameOver && mode && (
              <>
                <p className="text-2xl text-muted-foreground">
                  {mode === 'points'
                    ? 'Alcance 1000 pontos o mais rápido possível!'
                    : 'Faça o máximo de pontos em 1 minuto!'}
                </p>
                <Button
                  onClick={startGame}
                  size="lg"
                  className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 shadow-glow transition-all hover:scale-105"
                >
                  Começar
                </Button>
              </>
            )}
            {/* Play again button */}
            {gameOver && (
              <Button
                onClick={() => { setMode(null); setGameOver(false); }}
                size="lg"
                className="text-xl px-8 py-6 bg-primary hover:bg-primary/90 shadow-glow transition-all hover:scale-105"
              >
                Jogar Novamente
              </Button>
            )}
            <p className="text-muted-foreground text-sm">
              Arraste o rato para cortar os vinis!
            </p>
            {gameOver && cutAlbums.length > 0 && (
              <div className="mt-4 text-left px-2">
                <p className="text-lg font-bold mb-3">Álbuns Especiais Cortados:</p>
                <div className="cut-albums-list mt-3 space-y-3 max-h-[50vh] overflow-y-auto">
                  {cutAlbums.map(a => (
                    <div key={a.file} className="flex items-center gap-3 text-left">
                      <img src={a.img?.src} alt={a.album} className="w-16 h-16 object-cover rounded-lg shadow-md" />
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{a.album}</span>
                        <span className="text-xs text-muted-foreground">{a.artist}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      )}
    </div>
  );
};