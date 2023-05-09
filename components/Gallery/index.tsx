import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import { twMerge } from "tailwind-merge";
import PhotoAlbum from "react-photo-album";

import X from "@/components/Icons/X";

import { useAuthValues } from "@/contexts/contextAuth";

import useGallery from "@/hooks/useGallery";

import { IMAGE_MD_BLUR_DATA_URL, IMAGE_SIZE } from "@/libs/constants";

const GalleryView = () => {
  const carouselRef = useRef(null);
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchPageContent } = useGallery();

  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setImages] = useState<
    Array<{ src: string; hqSrc: string; width: number; height: number }>
  >([]);
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);

  const SINGLE_RESPONSIVENESS = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
      slideIndex: activeSlide,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1368 },
      items: 1,
      slideIndex: activeSlide,
    },
    tablet: {
      breakpoint: { max: 1368, min: 925 },
      items: 1,
      slideIndex: activeSlide,
    },
    mobile: {
      breakpoint: { max: 925, min: 0 },
      items: 1,
      slideIndex: activeSlide,
    },
  };

  const getSizeValue = (size: IMAGE_SIZE) => {
    const squareSize = 200;
    switch (size) {
      case IMAGE_SIZE.SQUARE:
        return { width: squareSize, height: squareSize };
      case IMAGE_SIZE.WIDE:
        return { width: squareSize * 2, height: squareSize };
      case IMAGE_SIZE.TALL:
        return { width: squareSize, height: squareSize * 2 };
      case IMAGE_SIZE.WIDEANDTALL:
        return { width: squareSize * 2, height: squareSize * 2 };
      default:
        return { width: squareSize, height: squareSize };
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPageContent().then((value) => {
        if (value) {
          setImages(
            value.images.map((image) => {
              return {
                src: image.compressedImage,
                hqSrc: image.image,
                ...getSizeValue(image.size),
              };
            })
          );
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <div className="relative w-full flex flex-col justify-start items-center">
      <div className="w-full p-5">
        <PhotoAlbum
          layout="masonry"
          photos={images}
          onClick={(props) => {
            setActiveSlide(props.index + 2);
            setIsCarouselVisible(true);
            if (carouselRef && carouselRef.current) {
              // @ts-ignore
              carouselRef.current.goToSlide(props.index + 2);
            }
          }}
        />
      </div>

      <div
        className={twMerge(
          "left-0 top-0 w-full h-screen p-5 flex justify-center items-center bg-[#000000aa] z-top",
          isCarouselVisible ? "fixed" : "hidden"
        )}
      >
        <div
          className="absolute top-0 left-0 w-full h-full"
          onClick={() => setIsCarouselVisible(false)}
        >
          <div className="absolute top-5 left-5 cursor-pointer">
            <X />
          </div>
        </div>
        <div className="w-full md:w-4/5 lg:w-11/12">
          <Carousel
            ref={carouselRef}
            ssr
            partialVisible
            autoPlay={false}
            responsive={SINGLE_RESPONSIVENESS}
            className="w-full max-h-screen bg-transparent"
            infinite
            swipeable
            draggable
            arrows
          >
            {images.map((image, index) => {
              return (
                <div
                  key={index}
                  className="w-full h-full flex justify-center items-center"
                >
                  <Image
                    className={twMerge(
                      "w-full object-cover md:object-none select-none pointer-events-none"
                    )}
                    src={image.hqSrc}
                    width={1600}
                    height={900}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_MD_BLUR_DATA_URL}
                  />
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
      {isLoading && <div className="loading"></div>}
    </div>
  );
};

export default GalleryView;
