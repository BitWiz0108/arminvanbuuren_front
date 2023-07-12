import { MUSIC_QUALITY, REPEAT } from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";

export interface IAudioPlayer {
  volume: number;
  isPlaying: boolean;
  trackProgress: number;
  currentPercentage: number;
  duration: number;
  musics: Array<IMusic>;
  setMusics: (musics: Array<IMusic>) => void;
  albumId: number | null;
  setAlbumId: (id: number | null) => void;
  getPlayingTrack: () => IMusic;
  play: () => void;
  pause: () => void;
  playNextMusic: () => void;
  playPreviousMusic: () => void;
  playingIndex: number;
  setPlayingIndex: (index: number) => void;
  playingQuality: MUSIC_QUALITY;
  setPlayingQuality: (option: MUSIC_QUALITY) => void;
  setVolume: (volume: number) => void;
  onScrub: (value: number) => void;
  onScrubEnd: () => void;
  repeatType: REPEAT;
  setRepeatType: (type: REPEAT) => void;
  isShuffled: boolean;
  setIsShuffled: (flag: boolean) => void;
}
