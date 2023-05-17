import { FILE_TYPE, PLACEHOLDER_IMAGE } from "@/libs/constants";

import { IReply } from "@/interfaces/IReply";

export interface IPost {
  id: number | null;
  author: any;
  title: string;
  type: FILE_TYPE;
  image: string;
  imageCompressed: string;
  video: string;
  videoCompressed: string;
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
  type: FILE_TYPE.IMAGE,
  image: PLACEHOLDER_IMAGE,
  imageCompressed: PLACEHOLDER_IMAGE,
  video: "",
  videoCompressed: "",
  content: "",
  createdAt: "",
  isFavorite: false,
  numberOfFavorites: 0,
  replies: [],
} as IPost;
