import { DEFAULT_COVER_IMAGE } from "@/libs/constants";

import { IReply } from "@/interfaces/IReply";

export interface IPost {
  id: number | null;
  author: any;
  title: string;
  image: string;
  compressedImage: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
  numberOfFavorites: number;
  replies: Array<IReply>;
}

export const DEFAULT_POST = {
  id: null,
  author: null,
  title: "",
  image: DEFAULT_COVER_IMAGE,
  compressedImage: DEFAULT_COVER_IMAGE,
  content: "",
  createdAt: "",
  isFavorite: false,
  numberOfFavorites: 0,
  replies: [],
};
