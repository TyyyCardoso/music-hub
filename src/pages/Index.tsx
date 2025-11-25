import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Gamepad2, Calendar, Newspaper, Music, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-music.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Map,
      title: "World Music Explorer",
      description: "Discover music and artists from every corner of the globe",
      path: "/world-map",
      color: "text-primary",
    },
    {
      icon: Gamepad2,
      title: "Guess the Music",
      description: "Test your music knowledge with our fun guessing game",
      path: "/game",
      color: "text-secondary",
    },
    {
      icon: Gamepad2,
      title: "Vinyl Slasher",
      description: "Slash Vinyls to your heart's content",
      path: "/ninjagame",
      color: "text-secondary",
    },
    {
      icon: Calendar,
      title: "Upcoming Releases",
      description: "Stay ahead with the latest album and single releases",
      path: "/releases",
      color: "text-accent",
    },
    {
      icon: Newspaper,
      title: "Music News",
      description: "Read the latest news and updates from the music industry",
      path: "/news",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Music waves"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="flex justify-center mb-6">
            <Music className="w-20 h-20 text-primary animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
            Global Music Hub
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/90 mb-12 font-light">
            Explore music from around the world, play games, and stay updated
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/world-map")}
              className="text-lg px-8 py-6"
            >
              <Map className="mr-2" />
              Explore World Music
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/game")}
              className="text-lg px-8 py-6"
            >
              <Gamepad2 className="mr-2" />
              Play Game
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/ninjagame")}
              className="text-lg px-8 py-6"
            >
              <Gamepad2 className="mr-2" />
              Play Game
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Discover Features
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to explore the world of music
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="card-glow cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <feature.icon className={`w-12 h-12 mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <TrendingUp className="w-12 h-12 mx-auto text-primary" />
              <div className="text-5xl font-bold gradient-text">50+</div>
              <div className="text-xl text-muted-foreground">Countries</div>
            </div>
            <div className="space-y-2">
              <Music className="w-12 h-12 mx-auto text-secondary" />
              <div className="text-5xl font-bold gradient-text">1000+</div>
              <div className="text-xl text-muted-foreground">Artists</div>
            </div>
            <div className="space-y-2">
              <Calendar className="w-12 h-12 mx-auto text-accent" />
              <div className="text-5xl font-bold gradient-text">100+</div>
              <div className="text-xl text-muted-foreground">New Releases</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
