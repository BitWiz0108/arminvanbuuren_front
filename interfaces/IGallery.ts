export interface IGallery {
  images: Array<{
    image: string;
    compressedImage: string;
  }>;
}

export const DEFAULT_GALLERY = {
  images: [],
} as IGallery;
