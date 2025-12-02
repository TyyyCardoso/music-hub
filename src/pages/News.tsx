// pages/News.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Newspaper, Search } from "lucide-react";
import { fetchUpcomingEvents } from "@/lib/api/ticketmaster";

interface NewsItem {
  title: string;
  description: string;
  category: string;
  date: string;
}

interface ConcertItem {
  id: string;
  title: string;
  artists: string[];
  country: string;
  city: string;
  venue: string;
  date: string;
  url: string;
}


export const allCountries: string[] = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria",
  "Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan",
  "Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia",
  "Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica",
  "Croatia","Cuba","Cyprus","Czech Republic","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador",
  "Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau",
  "Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait",
  "Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico",
  "Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Namibia","Nauru",
  "Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman",
  "Pakistan","Palau","Palestine State","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe",
  "Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia",
  "South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan",
  "Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Venezuela",
  "Vietnam","Yemen","Zambia","Zimbabwe"
];

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
  // ------------------- Noticias -------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(newsItems.map(n => n.category)))];

  const filteredNews = newsItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // ------------------- Concertos -------------------
  const [artistQuery, setArtistQuery] = useState("");
  const [country, setCountry] = useState("Portugal");
  const [concerts, setConcerts] = useState<ConcertItem[]>([]);
  const [loadingConcerts, setLoadingConcerts] = useState(false);
  const [searched, setSearched] = useState(false);
  const [countryList, setCountryList] = useState<string[]>([]);

  const handleSearchConcerts = async () => {
    setLoadingConcerts(true);
    setSearched(true);
    try {
      const data = await fetchUpcomingEvents(artistQuery, country);
      setConcerts(data);
    } catch (err) {
      setConcerts([]);
    }
    setLoadingConcerts(false);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* ------------------- Procurar Concertos ------------------- */}
        <div className="bg-neutral-900 p-6 rounded-xl shadow mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6">Procurar Concertos Futuros</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <Input
              placeholder="Nome do artista (opcional)"
              value={artistQuery}
              onChange={(e) => setArtistQuery(e.target.value)}
            />

            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Escolher País" />
              </SelectTrigger>
              <SelectContent className="max-h-72 overflow-y-auto">
                {allCountries.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

          </div>

          <button
            onClick={handleSearchConcerts}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Procurar Concertos
          </button>

          <div className="mt-6 space-y-4">
            {loadingConcerts && (
              <p className="text-muted-foreground text-center">A procurar...</p>
            )}

            {!loadingConcerts && concerts.length === 0 && searched && (
              <p className="text-muted-foreground text-center">Nenhum concerto encontrado.</p>
            )}

            {concerts.map((ev, idx) => (
              <Card key={idx} className="bg-blue-900 border-blue-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-semibold">
                    {ev.title}
                  </CardTitle>
                  <CardContent className="text-gray-300 space-y-1">
                    <div><strong>Artista(s):</strong> {ev.artists.length ? ev.artists.join(", ") : "Desconhecido"}</div>
                    <div><strong>Data:</strong> {new Date(ev.date).toLocaleString()}</div>
                    <div><strong>Localização:</strong> {ev.country}, {ev.city}</div>
                    <div><strong>Venue:</strong> {ev.venue}</div>

                    {ev.url && (
                      <div>
                        <a
                          href={ev.url}
                          target="_blank"
                          className="text-pink-400 underline"
                        >
                          Ver no Ticketmaster
                        </a>
                      </div>
                    )}
                  </CardContent>


                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
        {/* ---------------------------------------------------------- */}

        {/* ------------------- Notícias ------------------- */}
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
