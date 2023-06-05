import { LIVESTREAM_QUALITY } from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";

export interface IVideoPlayer {
  volume: number;
  isPlaying: boolean;
  setIsPlaying: Function;
  currentPercentage: number;
  duration: number;
  trackProgress: number;
  play: () => void;
  pause: () => void;
  playingIndex: number;
  setPlayingIndex: (index: number) => void;
  getPlayingTrack: () => IStream;
  playNextVideo: () => void;
  playPreviousVideo: () => void;
  setVideos: (videos: Array<IStream>) => void;
  playingQuality: LIVESTREAM_QUALITY;
  setPlayingQuality: (option: LIVESTREAM_QUALITY) => void;
  setVolume: (volume: number) => void;
  onScrub: (value: number) => void;
  onScrubEnd: () => void;
}
