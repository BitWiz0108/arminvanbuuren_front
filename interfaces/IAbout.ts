import { PLACEHOLDER_IMAGE } from "@/libs/constants";

export interface IAbout {
  coverImage1: string;
  coverImage2: string;
  content: string;
}

export const DEFAULT_ABOUT = {
  coverImage1: PLACEHOLDER_IMAGE,
  coverImage2: PLACEHOLDER_IMAGE,
  content: "",
} as IAbout;
