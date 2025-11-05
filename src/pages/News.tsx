import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

interface NewsItem {
  title: string;
  description: string;
  category: string;
  date: string;
}

const newsItems: NewsItem[] = [
  {
    title: "Taylor Swift Breaks Spotify Records",
    description: "Pop superstar Taylor Swift has become the most-streamed artist on Spotify, surpassing 100 million monthly listeners.",
    category: "Pop",
    date: "2025-11-01",
  },
  {
    title: "BTS Announces World Tour 2026",
    description: "K-pop sensation BTS reveals dates for their highly anticipated global stadium tour starting next summer.",
    category: "K-Pop",
    date: "2025-11-02",
  },
  {
    title: "Afrobeats Dominates Global Charts",
    description: "Nigerian artists Burna Boy and Wizkid continue to push Afrobeats to new international heights with chart-topping hits.",
    category: "Afrobeats",
    date: "2025-11-03",
  },
  {
    title: "Grammy Nominations 2026 Announced",
    description: "The Recording Academy reveals nominees across all categories, with surprise inclusions in major awards.",
    category: "Awards",
    date: "2025-11-04",
  },
  {
    title: "New Streaming Platform Launches",
    description: "Revolutionary music streaming service promises higher artist royalties and lossless audio quality for all subscribers.",
    category: "Industry",
    date: "2025-11-04",
  },
  {
    title: "Latin Music Reaches New Peak",
    description: "Bad Bunny and Rosalía lead Latin music's unprecedented growth in global market share.",
    category: "Latin",
    date: "2025-11-05",
  },
];

const News = () => {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Music News</h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest from the music world
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {newsItems.map((item, index) => (
            <Card key={index} className="card-glow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Newspaper className="text-accent w-6 h-6" />
                  <Badge variant="secondary">{item.category}</Badge>
                </div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
