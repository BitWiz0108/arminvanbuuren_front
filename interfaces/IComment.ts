import { IProfile } from "@/interfaces/IProfile";

export interface IComment {
  id: number;
  livestreamId: number;
  userId: number;
  author: IProfile;
  content: string;
  createdAt: string;
}
