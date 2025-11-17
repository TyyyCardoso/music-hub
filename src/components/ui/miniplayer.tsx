import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface MiniPlayerProps {
  songTitle: string;
}

const MiniPlayer = ({ songTitle }: MiniPlayerProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(songTitle)}&entity=song&limit=1`)
      .then(res => res.json())
      .then(data => setPreviewUrl(data.results[0]?.previewUrl || null))
      .catch(console.error);
  }, [songTitle]);

  if (!previewUrl) return null;

  return (
    <div className="mini-player">
      <AudioPlayer src={previewUrl} autoPlay showJumpControls={false}
        customAdditionalControls={[]} layout="horizontal" className="rounded-xl"
        style={{
         background: "linear-gradient(135deg, rgba(231, 3, 201, 0.6), rgba(131,58,180,0.18))",
        } as React.CSSProperties}
      />
    </div>
  );
};

export default MiniPlayer;
