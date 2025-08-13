import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export const ShareMenu = ({ trackLink, title, artist }) => {
  const cardRef = useRef();
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async () => {
    const dataUrl = await toPng(cardRef.current, { skipFonts: true, useCORS: true });
    setImageUrl(dataUrl);
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${title} by ${artist}\n${trackLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`🎵 ${title} by ${artist}\n${trackLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div>
      <button onClick={generateImage}>Prepare Share</button>

      {imageUrl && (
        <div className="flex gap-2 mt-2">
          <button onClick={shareToWhatsApp}>WhatsApp</button>
          <button onClick={shareToTwitter}>Twitter/X</button>
          <a href={imageUrl} download="track.png">Download Image</a>
        </div>
      )}

      {/* Hidden card capture area */}
      <div ref={cardRef} style={{ position: "absolute", left: "-9999px" }}>
        <div>
            Share this Song
        </div>
      </div>
    </div>
  );
};
