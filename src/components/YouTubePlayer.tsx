import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

const YouTubePlayer = ({ isOpen, onClose, videoId, title }: YouTubePlayerProps) => {
  // Check if videoId is a search query marker
  const isSearchQuery = videoId.startsWith('SEARCH:');
  const searchQuery = isSearchQuery ? videoId.replace('SEARCH:', '') : '';
  const searchUrl = isSearchQuery ? `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}` : '';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isSearchQuery ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">YouTube API key not configured</p>
              <p className="text-sm text-muted-foreground">
                To play videos directly, add your YouTube API key to <code className="bg-muted px-1 py-0.5 rounded">.env</code>
              </p>
              <p className="text-xs text-muted-foreground mt-4">
                Add: <code className="bg-muted px-1 py-0.5 rounded">VITE_YOUTUBE_API_KEY=your_key_here</code>
              </p>
            </div>
            <Button 
              onClick={() => window.open(searchUrl, '_blank')}
              className="mt-4"
            >
              Search on YouTube
            </Button>
          </div>
        ) : (
          <div className="relative w-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default YouTubePlayer;
