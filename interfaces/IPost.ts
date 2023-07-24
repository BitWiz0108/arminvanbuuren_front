import { FILE_TYPE, PLACEHOLDER_IMAGE } from "@/libs/constants";

import { IReply } from "@/interfaces/IReply";

export interface IPostAsset {
  id?: number | null;
  postId?: number | null;
  type: FILE_TYPE;
  file: string;
  fileCompressed: string;
}

export interface IPost {
  id: number | null;
  author: any;
  title: string;
  content: string;
  createdAt: string;
  isFavorite: boolean;
  numberOfFavorites: number;
  replies: Array<IReply>;
  files: Array<IPostAsset>;
  releaseDate: string;
}

export const DEFAULT_POST = {
  id: null,
  author: null,
  title: "",
  content: "",
  createdAt: "",
  isFavorite: false,
  numberOfFavorites: 0,
  replies: [],
  files: [],
  releaseDate: "",
} as IPost;
