import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import { IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";

type Props = {
  index: number;
  image: { image: string; compressedImage: string };
  onClick: Function;
};

const GalleryItem = ({ index, image, onClick }: Props) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = () => {
    if (hovered) return;
    setHovered(true);
  };

  const onOut = () => {
    if (!hovered) return;
    setHovered(false);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer"
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
      onClick={() => onClick(index)}
    >
      <Image
        className={twMerge(
          "w-full h-full object-cover transition-all duration-300",
          hovered ? "scale-110" : "scale-100"
        )}
        src={image.compressedImage}
        width={500}
        height={500}
        alt=""
        placeholder="blur"
        blurDataURL={IMAGE_MD_BLUR_DATA_URL}
      />

      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-0 top-0 w-full h-full bg-[#000000aa]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
