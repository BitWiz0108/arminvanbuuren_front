import { IMAGE_SIZE } from "@/libs/constants";

export interface IGallery {
  images: Array<IImage>;
}

export interface IImage {
  id: number | null;
  image: string;
  compressedImage: string;
  size: IMAGE_SIZE;
  description: string;
}

export const DEFAULT_GALLERY = {
  images: [],
} as IGallery;

export const DEFAULT_IMAGE = {
  id: null,
  image: "",
  compressedImage: "",
  size: IMAGE_SIZE.SQUARE,
  description: "",
};
