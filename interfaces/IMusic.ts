import { PLACEHOLDER_IMAGE } from "@/libs/constants";

export interface IMusic {
  id: number | null;
  title: string;
  singer: any;
  creator: any;
  duration: number;
  description: string;
  coverImage: string;
  musicFile: string;
  musicFileCompressed: string;
  videoBackground: string;
  videoBackgroundCompressed: string;
  isFavorite: boolean;
  isExclusive: boolean;
  lyrics: string;
  copyright: string;
}

export const DEFAULT_MUSIC = {
  id: null,
  title: "",
  singer: null,
  creator: null,
  duration: 0,
  description: "",
  coverImage: PLACEHOLDER_IMAGE,
  musicFile: "",
  musicFileCompressed: "",
  videoBackground: "",
  videoBackgroundCompressed: "",
  isFavorite: false,
  isExclusive: false,
  lyrics: "",
  copyright: "",
} as IMusic;
