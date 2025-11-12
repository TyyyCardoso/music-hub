import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface YouTubePlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const YouTubePlayer = ({ isOpen, onClose, videoId, title }: YouTubePlayerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative w-full pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayer;
