import { useState, useEffect, useRef } from "react";

import { LIVESTREAM_QUALITY } from "@/libs/constants";

import { DEFAULT_STREAM, IStream } from "@/interfaces/IStream";

const useVideoPlayer = (videoRef: any) => {
  const [volume, setVolume] = useState<number>(100);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videos, setVideos] = useState<Array<IStream>>([DEFAULT_STREAM]);
  const [playingIndex, setPlayingIndex] = useState<number>(0);
  const [playingQuality, setPlayingQuality] = useState<LIVESTREAM_QUALITY>(
    LIVESTREAM_QUALITY.AUTO
  );

  const intervalRef = useRef<NodeJS.Timer>();
  const isReady = useRef<boolean>(false);

  const duration = videoRef?.current?.duration ?? 0;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (videoRef.current) {
        if (videoRef.current.ended) {
          playNextVideo();
        } else {
          setTrackProgress(videoRef.current.currentTime);
        }
      }
    }, 1000);
  };

  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);
    // @ts-ignore
    if (videoRef.current) {
      videoRef.current.currentTime = value;
      setTrackProgress(videoRef.current?.currentTime ?? 0);

      onScrubEnd();
    }
  };

  const onScrubEnd = () => {
    // If not already playing, start
    if (!isPlaying) {
      setIsPlaying(true);
    }
    startTimer();
  };

  const getPlayingTrack = () => {
    return videos[playingIndex] ? videos[playingIndex] : DEFAULT_STREAM;
  };

  const playNextVideo = () => {
    setPlayingIndex((prev) => {
      if (prev < videos.length - 1) {
        return prev + 1;
      }
      return 0;
    });
  };

  const playPreviousVideo = () => {
    setPlayingIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return videos.length - 1;
    });
  };

  const play = () => {
    if (isPlaying) return;
    setIsPlaying(true);
  };

  const pause = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    setCurrentPercentage(duration ? (trackProgress / duration) * 100 : 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackProgress, duration]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
        videoRef.current.volume = volume / 100;
        startTimer();
      } else {
        videoRef.current?.pause();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    try {
      videoRef.current?.pause();

      let myVideo = videoRef.current;
      if (playingQuality == LIVESTREAM_QUALITY.LOW) {
        myVideo.src = videos[playingIndex].fullVideoCompressed;
      } else {
        myVideo.src = videos[playingIndex].fullVideo;
      }

      videoRef.current.currentTime = 0;
      setTrackProgress(0);
      if (isReady.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            startTimer();
          })
          .catch((e: any) => {
            console.log(e);
            setIsPlaying(false);
          });
        videoRef.current.volume = volume / 100;
      } else {
        // Set the isReady ref as true for the next pass
        isReady.current = true;
      }
    } catch (e) {
      console.log(e);
      setIsPlaying(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIndex, videoRef, playingQuality]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      videoRef.current?.pause();
      clearInterval(intervalRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    volume,
    isPlaying,
    currentPercentage,
    duration,
    trackProgress,
    play,
    pause,
    playingIndex,
    setPlayingIndex,
    getPlayingTrack,
    playNextVideo,
    playPreviousVideo,
    setVideos,
    playingQuality,
    setPlayingQuality,
    setVolume,
    onScrub,
    onScrubEnd,
  };
};

export default useVideoPlayer;
