import { PLACEHOLDER_IMAGE } from "@/libs/constants";

export interface IStream {
  id: number | null;
  coverImage: string;
  previewVideo: string;
  previewVideoCompressed: string;
  fullVideo: string;
  fullVideoCompressed: string;
  title: string;
  lyrics: string;
  singer: any;
  creator: any;
  description: string;
  shortDescription: string;
  releaseDate: string;
  duration: number;
  liveDate: string;
  isExclusive: boolean;
  isFavorite: boolean;
}

export const DEFAULT_STREAM = {
  id: null,
  coverImage: PLACEHOLDER_IMAGE,
  previewVideo: "",
  previewVideoCompressed: "",
  fullVideo: "",
  fullVideoCompressed: "",
  title: "",
  lyrics: "",
  singer: null,
  creator: null,
  description: "",
  shortDescription: "",
  releaseDate: "",
  duration: 0,
  liveDate: "",
  isExclusive: false,
  isFavorite: false,
} as IStream;
