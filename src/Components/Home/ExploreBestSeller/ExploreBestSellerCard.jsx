import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";

export default function ExploreBestSellerCard({ product }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && !isClicked) {
      videoRef.current.muted = true;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && !isClicked) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleClick = () => {
    if (!videoRef.current) return;

    if (!isClicked) {
      // Play with sound
      videoRef.current.muted = false;
      videoRef.current.play();
    } else {
      // Pause and reset if clicked again
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    setIsClicked(!isClicked);
  };

  return (
    <div
      key={product.prd_id}
      className="feature-card p-0  position-relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="card-img">
        <video
          ref={videoRef}
          src={product.video_url}
          poster={product.img_url}
          className="w-100 rounded"
          preload="metadata"
          loop
        />
        {!isHovered && !isClicked && (
          <span className="disco rounded-circle position-absolute top-50 start-50 translate-middle">
            <FontAwesomeIcon icon={faPlay} size="lg" />
          </span>
        )}
      </div>
    </div>
  );
}
