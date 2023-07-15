import { IMusic } from "@/interfaces/IMusic";
import { IUser } from "@/interfaces/IUser";

export interface IPlaylist {
  id: number | null;
  musicIds: Array<number>;
  musics: Array<IMusic>;
  name: string;
  creator: IUser;
}
