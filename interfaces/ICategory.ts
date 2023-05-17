import { IStream } from "@/interfaces/IStream";

export interface ICategory {
  id: number | null;
  name: string;
  singer: any;
  description: string;
  copyright: string;
  size: number;
  hours: number;
  livestreams: Array<IStream>;
}

export const DEFAULT_CATEGORY = {
  id: null,
  name: "",
  singer: null,
  description: "",
  copyright: "",
  size: 0,
  hours: 0,
  livestreams: [],
} as ICategory;
