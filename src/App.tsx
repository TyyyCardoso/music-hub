import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Index from "./pages/Index";
import WorldMap from "./pages/WorldMap";
import Game from "./pages/Game";
import Releases from "./pages/Releases";
import News from "./pages/News";
import TaylorSwiftTracker from "./pages/TaylorSwiftTracker";
import ArtistProfile from "./pages/ArtistProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<WorldMap />} />
          <Route path="/game" element={<Game />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/news" element={<News />} />
          <Route path="/taylor-swift-tracker" element={<TaylorSwiftTracker />} />
          <Route path="/artist/:artistId" element={<ArtistProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
