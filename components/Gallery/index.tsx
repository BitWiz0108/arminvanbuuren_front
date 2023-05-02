import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import { twMerge } from "tailwind-merge";

import GalleryItem from "@/components/GalleryItem";
import X from "@/components/Icons/X";

import { useAuthValues } from "@/contexts/contextAuth";

import useGallery from "@/hooks/useGallery";

import { IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";

import { DEFAULT_GALLERY } from "@/interfaces/IGallery";

const GalleryView = () => {
  const carouselRef = useRef(null);
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchPageContent } = useGallery();

  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setImages] = useState<
    Array<{
      image: string;
      compressedImage: string;
    }>
  >(DEFAULT_GALLERY.images);
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

  useEffect(() => {
    if (isSignedIn) {
      fetchPageContent().then((value) => {
        if (value) {
          setImages(value.images);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <div className="relative w-full flex flex-col justify-start items-center">
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {images.map((image, index) => {
          return (
            <div className="col-span-1" key={index}>
              <GalleryItem
                index={index}
                image={image}
                onClick={(index: number) => {
                  setActiveSlide(index);
                  setIsCarouselVisible(true);
                  if (carouselRef && carouselRef.current) {
                    // @ts-ignore
                    carouselRef.current.goToSlide(index);
                  }
                }}
              />
            </div>
          );
        })}
      </div>

      <div
        className={twMerge(
          "left-0 top-0 w-full h-screen px-5 lg:px-10 pt-5 lg:pt-10 pb-24 lg:pb-36 flex justify-center items-center bg-[#000000aa] z-top",
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
        <div className="w-full md:w-4/5 lg:5/6">
          <Carousel
            ref={carouselRef}
            ssr
            partialVisible
            autoPlay={false}
            responsive={SINGLE_RESPONSIVENESS}
            className="w-full max-h-[640px] bg-transparent"
            infinite
            swipeable
            draggable
            arrows
          >
            {images.map((image, index) => {
              return (
                <div key={index} className="w-full h-full">
                  <Image
                    className={twMerge(
                      "w-full h-full object-contain select-none pointer-events-none"
                    )}
                    src={image.image}
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
