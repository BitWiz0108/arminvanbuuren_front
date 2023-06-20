import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Carousel from "react-multi-carousel";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";
import ButtonCircle from "@/components/ButtonCircle";
import GalleryItem from "@/components/GalleryItem";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useGallery from "@/hooks/useGallery";

import {
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";

import { IImage } from "@/interfaces/IGallery";

const GalleryView = () => {
  const carouselRef = useRef<Carousel>(null);
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchPageContent } = useGallery();
  const { audioPlayer } = useShareValues();
  const { toggleFullscreen } = useSizeValues();

  const [activeSlide, setActiveSlide] = useState(0);
  const [images, setImages] = useState<Array<IImage>>([]);
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);
  const [lastPosX, setLastPosX] = useState<number>(0);

  const SINGLE_RESPONSIVENESS = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1368 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1368, min: 925 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 925, min: 0 },
      items: 1,
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

  useEffect(() => {
    toggleFullscreen(isCarouselVisible);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCarouselVisible]);

  return (
    <div className="relative w-full flex flex-col justify-start items-center">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <GalleryItem
            key={index}
            image={image}
            onClick={() => {
              setActiveSlide(index + 2);
              setIsCarouselVisible(true);
              if (carouselRef && carouselRef.current) {
                carouselRef.current.goToSlide(index + 2);
              }
              if (image.type == FILE_TYPE.VIDEO) {
                audioPlayer.pause();
                const videos = document.getElementsByClassName(
                  "carousel-video-player"
                );
                for (let i = 0; i < videos.length; i++) {
                  if (image.video == videos[i].getAttribute("src")) {
                    (videos[i] as HTMLVideoElement).play();
                  }
                }
              }
            }}
          />
        ))}
      </div>

      <div
        className={twMerge(
          "left-0 top-0 w-screen h-screen flex justify-center items-center bg-[#000000aa] z-top",
          isCarouselVisible ? "fixed" : "hidden"
        )}
      >
        <div className="absolute top-5 left-5 cursor-pointer z-10">
          <ButtonCircle
            dark={false}
            icon={<X />}
            size="small"
            onClick={() => {
              setIsCarouselVisible(false);
              audioPlayer.play();
            }}
          />
        </div>
        <div className="relative w-full z-0">
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
            beforeChange={() => {
              const videos = document.getElementsByClassName(
                "carousel-video-player"
              );
              for (let i = 0; i < videos.length; i++) {
                (videos[i] as HTMLVideoElement).pause();
              }
            }}
            afterChange={(prevSlide, state) => {
              setActiveSlide(state.currentSlide);

              const videos = document.getElementsByClassName(
                "carousel-video-player"
              );
              for (let i = 0; i < videos.length; i++) {
                (videos[i] as HTMLVideoElement).pause();
              }
              if (
                images[state.currentSlide - 2] &&
                images[state.currentSlide - 2].type == FILE_TYPE.VIDEO
              ) {
                for (let i = 0; i < videos.length; i++) {
                  if (
                    images[state.currentSlide - 2].video ==
                    videos[i].getAttribute("src")
                  ) {
                    (videos[i] as HTMLVideoElement).play();
                  }
                }
              }
            }}
          >
            {images.map((image, index) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-full flex justify-center items-center z-0"
                  onMouseDown={(e) => setLastPosX(e.screenX)}
                  onMouseUp={(e) => {
                    if (image.type == FILE_TYPE.VIDEO) return;
                    if (Math.abs(e.screenX - lastPosX) < 30) {
                      setIsCarouselVisible(false);
                    }
                  }}
                >
                  {image.type == FILE_TYPE.IMAGE ? (
                    <Image
                      className="relative w-full md:w-auto h-auto md:h-full object-center select-none pointer-events-none z-10"
                      width={800}
                      height={800}
                      src={image.image ?? PLACEHOLDER_IMAGE}
                      loading="eager"
                      alt=""
                      placeholder="blur"
                      blurDataURL={IMAGE_BLUR_DATA_URL}
                      priority
                    />
                  ) : (
                    <div className="relative max-h-screen w-full h-full z-10">
                      <video
                        controls
                        autoPlay={index == activeSlide - 2}
                        playsInline
                        disablePictureInPicture
                        controlsList="nodownload nopictureinpicture noplaybackrate"
                        className="absolute inset-0 object-center w-full h-full rounded-md carousel-video-player"
                        src={image.video}
                        onPlay={() => {
                          audioPlayer.pause();
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </div>
  );
};

export default GalleryView;
