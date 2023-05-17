import { FILE_TYPE, IMAGE_SIZE, PLACEHOLDER_IMAGE } from "@/libs/constants";

export interface IGallery {
  images: Array<IImage>;
}

export interface IImage {
  id: number | null;
  type: FILE_TYPE;
  image: string;
  imageCompressed: string;
  video: string;
  videoCompressed: string;
  size: IMAGE_SIZE;
  description: string;
}

export const DEFAULT_GALLERY = {
  images: [],
} as IGallery;

export const DEFAULT_IMAGE = {
  id: null,
  image: PLACEHOLDER_IMAGE,
  imageCompressed: PLACEHOLDER_IMAGE,
  video: "",
  videoCompressed: "",
  size: IMAGE_SIZE.SQUARE,
  description: "",
} as IImage;
