import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";

import VideoPlayer from "@/components/VideoPlayer";

import { useSizeValues } from "@/contexts/contextSize";

import {
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  IMAGE_SIZE,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";

import { IImage } from "@/interfaces/IGallery";

type Props = {
  image: IImage;
  onClick: Function;
};

const GalleryItem = ({ image, onClick }: Props) => {
  const { isMobile } = useSizeValues();

  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = () => {
    if (hovered) return;
    setHovered(true);
  };

  const onOut = () => {
    if (!hovered) return;
    setHovered(false);
  };

  const itemClass = twMerge(
    "relative overflow-hidden cursor-pointer",
    image.size == IMAGE_SIZE.SQUARE
      ? "col-span-1 row-span-1"
      : image.size == IMAGE_SIZE.WIDE
      ? "col-span-1 md:col-span-2 row-span-1"
      : image.size == IMAGE_SIZE.TALL
      ? "col-span-1 row-span-1 md:row-span-2"
      : "col-span-1 md:col-span-2 row-span-1 md:row-span-2"
  );

  const imageClass = twMerge(
    "w-full h-full object-cover transition-all duration-300",
    hovered ? "scale-110" : "scale-100",
    image.size == IMAGE_SIZE.SQUARE
      ? "min-w-[200px] min-h-[200px] max-h-[400px]"
      : image.size == IMAGE_SIZE.WIDE
      ? "min-w-[400px] min-h-[200px] max-h-[400px]"
      : image.size == IMAGE_SIZE.TALL
      ? "min-w-[200px] min-h-[400px] max-h-[800px]"
      : "min-w-[400px] min-h-[400px] max-h-[800px]"
  );

  return (
    <div
      className={itemClass}
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
      onClick={() => onClick()}
    >
      {image.type == FILE_TYPE.IMAGE ? (
        <Image
          className={imageClass}
          src={image.imageCompressed ?? PLACEHOLDER_IMAGE}
          width={800}
          height={800}
          alt=""
          placeholder="blur"
          blurDataURL={IMAGE_BLUR_DATA_URL}
          priority
        />
      ) : (
        <VideoPlayer
          loop
          muted
          autoPlay
          playsInline
          disablePictureInPicture
          controls={false}
          className={imageClass}
          src={image.videoCompressed}
        />
      )}

      <AnimatePresence>
        {(hovered || isMobile) && (
          <motion.div
            className="absolute left-0 top-0 w-full h-full bg-transparent md:bg-[#000000aa] flex justify-end items-start p-2 text-primary space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryItem;
