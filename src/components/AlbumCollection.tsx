import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import albumsJSON from "@/assets/albums/albums.json";

interface Album {
  album: string;
  artist: string;
  tag?: string;
  rank?: number;
  file: string;
  img?: HTMLImageElement;
}

interface AlbumCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unlockedAlbums: Set<string>;
  setUnlockedAlbums: React.Dispatch<React.SetStateAction<Set<string>>>;
}


export const AlbumCollectionDialog = ({
  open,
  onOpenChange,
  unlockedAlbums,
  setUnlockedAlbums,
}: AlbumCollectionDialogProps) => {
  const [sortBy, setSortBy] = useState<"rank" | "alphabetical">("rank");

  // Carregar imagens
  const albums: Album[] = albumsJSON.map((a) => {
    const img = new Image();
    img.src = `/src/assets/albums/${a.file}`;
    return { ...a, img };
  });

  // Ordenação
  const sortedAlbums = [...albums].sort((a, b) => {
    if (sortBy === "rank") return (a.rank ?? 999) - (b.rank ?? 999);
    return a.album.localeCompare(b.album);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">

        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center mb-4">
            Caderneta de Álbuns
          </DialogTitle>

            {/* Filtro bonito :) */}
            <div className="flex justify-between items-center mb-4 px-5">
                {/* Mensagem à esquerda */}
                <p className="text-sm  font-bold">
                    Para mais informação sobre estes álbuns fale com o nosso chatbot!
                </p>

                {/* Seletor de ordem */}
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-sm text-muted-foreground">Ordem:</span>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as "rank" | "alphabetical")}>
                    <SelectTrigger className="w-36 p-2">
                        <SelectValue placeholder="Escolher..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="rank">Popularidade</SelectItem>
                        <SelectItem value="alphabetical">Alfabética</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>

        </DialogHeader>

        {/* Grelha 5 x n */}
        <div className="grid grid-cols-5 gap-12 px-5">
          {sortedAlbums.map((album) => {
            const isUnlocked = unlockedAlbums.has(album.file);

            return (
              <div
                key={album.file}
                className="flex flex-col items-center text-center rounded-lg transition-all"
              >
                <img
                  src={`/albums/${album.img?.src}`} 
                  alt={album.album}
                  className={`w-23 h-23 rounded-lg shadow-md object-cover mb-2
                    ${!isUnlocked ? "grayscale blur-[5px] opacity-70" : ""}
                  `}
                />

                <span
                  className={`font-bold text-sm leading-tight ${
                    !isUnlocked ? "text-muted-foreground" : ""
                  }`}
                >
                  {isUnlocked ? album.album : "???"}
                </span>

                <span
                  className={`text-xs text-muted-foreground ${
                    !isUnlocked ? "opacity-70" : ""
                  }`}
                >
                  {isUnlocked ? album.artist : "???"}
                </span>
              </div>
            );
          })}
        </div>
        
        <div className="relative mt-4 pb-2">
            {/* Texto centrado */}
            <div className="text-center text-muted-foreground">
                {unlockedAlbums.size} / {albums.length} álbuns desbloqueados
            </div>

            {/* Botão no canto inferior direito */}
            <button className="absolute right-2 bottom-0 px-3 py-1.5 text-sm rounded-md 
                            bg-destructive text-destructive-foreground 
                            hover:bg-destructive/80 transition"
                onClick={() => {
                    localStorage.removeItem("unlockedAlbums");
                    setUnlockedAlbums(new Set());
                }}
            >Apagar Caderneta</button>

        </div>






      </DialogContent>
    </Dialog>
  );
};
