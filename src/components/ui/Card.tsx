import { motion, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";

//Spring animation parameters
const spring = {
  stiffness: 300,
  damping: 40,
};

/**
 * 3D Flip
 * Created By Joshua Guo
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

export const Card = ({
  width,
  height,
  image_url,
  isFlipped = false,
}: {
  width?: string;
  height?: string;
  image_url: string | undefined; // can be null when card is not flipped
  isFlipped: boolean;
}) => {
  const handleClick = () => {};

  const [rotateXaxis, setRotateXaxis] = useState(0);
  const [rotateYaxis, setRotateYaxis] = useState(0);
  const ref = useRef(null);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const elementRect = (element as HTMLDivElement).getBoundingClientRect();
    const elementWidth = elementRect.width;
    const elementHeight = elementRect.height;
    const elementCenterX = elementWidth / 2;
    const elementCenterY = elementHeight / 2;
    const mouseX = event.clientY - elementRect.y - elementCenterY;
    const mouseY = event.clientX - elementRect.x - elementCenterX;
    const degreeX = (mouseX / elementWidth) * 30; //The number is the rotation factor
    const degreeY = (mouseY / elementHeight) * 30; //The number is the rotation factor
    setRotateXaxis(degreeX);
    setRotateYaxis(degreeY);
  };

  const handleMouseEnd = () => {
    setRotateXaxis(0);
    setRotateYaxis(0);
  };

  const dx = useSpring(0, spring);
  const dy = useSpring(0, spring);

  useEffect(() => {
    dx.set(-rotateXaxis);
    dy.set(rotateYaxis);
  }, [rotateXaxis, rotateYaxis]);

  const [cardUrl, setCardUrl] = useState<string | undefined>(image_url);

  useEffect(() => {
    if (image_url) {
      setCardUrl(image_url);
    } else {
      // wait 300ms then set to null
      const timer = setTimeout(() => {
        setCardUrl(undefined);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [image_url]);

  return (
    <motion.div
      onClick={handleClick}
      transition={spring}
      style={{
        perspective: "1200px",
        transformStyle: "preserve-3d",
        width: `${width || "200px"}`,
        height: `${height || "300px"}`,
      }}
    >
      <motion.div
        ref={ref}
        whileHover={!isFlipped ? { scale: 1.1 } : {}} //Change the scale of zooming in when hovering
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseEnd}
        transition={spring}
        style={{
          width: "100%",
          height: "100%",
          rotateX: dx,
          rotateY: dy,
        }}
      >
        <div
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            width: "100%",
            height: "100%",
          }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? -180 : 0 }}
            transition={spring}
            style={{
              width: "100%",
              height: "100%",
              zIndex: isFlipped ? 0 : 1,
              backfaceVisibility: "hidden",
              position: "absolute",
            }}
          >
            <img
              src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
              alt="Card Back"
              className="w-full h-full rounded-md"
            />
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            transition={spring}
            style={{
              width: "100%",
              height: "100%",
              zIndex: isFlipped ? 1 : 0,
              backfaceVisibility: "hidden",
              position: "absolute",
            }}
          >
            <img
              src={cardUrl}
              alt="Card Back"
              className="w-full h-full rounded-md"
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
