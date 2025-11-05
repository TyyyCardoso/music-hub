import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Newspaper, Search } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(newsItems.map(n => n.category)))];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Notícias Musicais</h1>
          <p className="text-xl text-muted-foreground">
            As últimas novidades do mundo da música
          </p>
        </div>

        <div className="mb-8 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Pesquisar notícias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.slice(1).map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredNews.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-muted-foreground">Nenhuma notícia encontrada</p>
            </div>
          ) : (
            filteredNews.map((item, index) => (
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default News;
