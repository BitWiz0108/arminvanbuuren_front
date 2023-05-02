import { IMusic } from "@/interfaces/IMusic";

export interface IAlbum {
  id: number | null;
  name: string;
  singer: any;
  description: string;
  copyright: string;
  size: number;
  hours: number;
  musics: Array<IMusic>;
}

export const DEFAULT_ALBUM = {
  id: null,
  name: "",
  singer: null,
  description: "",
  copyright: "",
  size: 0,
  hours: 0,
  musics: [],
} as IAlbum;
