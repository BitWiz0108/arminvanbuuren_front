import { FILE_TYPE, IMAGE_BLUR_DATA_URL } from "@/libs/constants";

export interface IHomepage {
  type: FILE_TYPE;
  backgroundVideo: string;
  backgroundVideoCompressed: string;
  backgroundImage: string;
  backgroundImageCompressed: string;
  homePageDescription: string;
  signInDescription: string;
}

export const DEFAULT_HOMEPAGE = {
  type: FILE_TYPE.IMAGE,
  backgroundVideo: "",
  backgroundVideoCompressed: "",
  backgroundImage: IMAGE_BLUR_DATA_URL,
  backgroundImageCompressed: IMAGE_BLUR_DATA_URL,
  homePageDescription: "",
  signInDescription: "",
} as IHomepage;
