import { useState, useEffect, useRef } from "react";

import { MUSIC_QUALITY, REPEAT } from "@/libs/constants";

import { DEFAULT_MUSIC, IMusic } from "@/interfaces/IMusic";
import { getRandomIndex } from "@/libs/utils";

const useAudioPlayer = () => {
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [musics, setMusics] = useState<Array<IMusic>>([DEFAULT_MUSIC]);
  const [volume, setVolume] = useState<number>(100);
  const [currentPercentage, setCurrentPercentage] = useState<number>(0);
  const [trackProgress, setTrackProgress] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingIndex, setPlayingIndex] = useState<number>(0);
  const [playingQuality, setPlayingQuality] = useState<MUSIC_QUALITY>(
    MUSIC_QUALITY.AUTO
  );
  const [repeatType, setRepeatType] = useState<REPEAT>(REPEAT.ALL);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>();
  const intervalRef = useRef<NodeJS.Timer>();
  const isReady = useRef<boolean>(false);

  const duration = audioRef.current?.duration ?? 0;

  const startTimer = () => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        if (audioRef.current.ended) {
          if (repeatType == REPEAT.ONE) {
            onScrub(0);
            audioRef.current.play();
          } else {
            if (isShuffled) {
              playRandomMusic();
            } else {
              playNextMusic();
            }
          }
        } else {
          setTrackProgress(audioRef.current.currentTime);
        }
      }
    }, 1000);
  };

  const onScrub = (value: number) => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setTrackProgress(audioRef.current.currentTime);

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

  const play = () => {
    if (isPlaying) return;
    setIsPlaying(true);
  };

  const pause = () => {
    if (!isPlaying) return;
    setIsPlaying(false);
  };

  const playRandomMusic = () => {
    setPlayingIndex((prev) => {
      if (musics.length == 1) return 0;

      let index = getRandomIndex(musics.length);
      while (index == prev) {
        index = getRandomIndex(musics.length);
      }
      return index;
    });
  };

  const playNextMusic = () => {
    setPlayingIndex((prev) => {
      if (prev < musics.length - 1) {
        return prev + 1;
      }
      return 0;
    });
  };

  const playPreviousMusic = () => {
    setPlayingIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return musics.length - 1;
    });
  };

  const getPlayingTrack = () => {
    return musics[playingIndex] ? musics[playingIndex] : DEFAULT_MUSIC;
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volume]);

  useEffect(() => {
    setCurrentPercentage(duration ? (trackProgress / duration) * 100 : 0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackProgress, duration]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
        audioRef.current.volume = volume / 100;
        startTimer();
      } else {
        audioRef.current.pause();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isShuffled, repeatType]);

  useEffect(() => {
    if (!isPlaying) {
      try {
        if (audioRef.current) {
          audioRef.current.pause();
        }

        if (
          playingQuality == MUSIC_QUALITY.LOW &&
          musics[playingIndex].musicFileCompressed
        ) {
          audioRef.current = new Audio(
            musics[playingIndex].musicFileCompressed
          );
        } else {
          audioRef.current = new Audio(musics[playingIndex].musicFile);
        }
        setTrackProgress(audioRef.current.currentTime);

        if (isReady.current) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              startTimer();
            })
            .catch((e: any) => {
              console.log(e);
              setIsPlaying(false);
            });
          audioRef.current.volume = volume / 100;
        } else {
          // Set the isReady ref as true for the next pass
          isReady.current = true;
        }
      } catch (e) {
        console.log(e);
        setIsPlaying(false);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musics]);

  // Handles cleanup and setup when changing tracks
  useEffect(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      if (
        playingQuality == MUSIC_QUALITY.LOW &&
        musics[playingIndex].musicFileCompressed
      ) {
        audioRef.current = new Audio(musics[playingIndex].musicFileCompressed);
      } else {
        audioRef.current = new Audio(musics[playingIndex].musicFile);
      }

      setTrackProgress(audioRef.current.currentTime);

      if (isReady.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            startTimer();
          })
          .catch((e: any) => {
            console.log(e);
            setIsPlaying(false);
          });
        audioRef.current.volume = volume / 100;
      } else {
        // Set the isReady ref as true for the next pass
        isReady.current = true;
      }
    } catch (e) {
      console.log(e);
      setIsPlaying(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIndex, audioRef, playingQuality]);

  useEffect(() => {
    // Pause and clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      clearInterval(intervalRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    volume,
    isPlaying,
    trackProgress,
    currentPercentage,
    duration,
    musics,
    setMusics,
    albumId,
    setAlbumId,
    getPlayingTrack,
    play,
    pause,
    playNextMusic,
    playPreviousMusic,
    playingIndex,
    setPlayingIndex,
    playingQuality,
    setPlayingQuality,
    setVolume,
    onScrub,
    onScrubEnd,
    repeatType,
    setRepeatType,
    isShuffled,
    setIsShuffled,
  };
};

export default useAudioPlayer;
