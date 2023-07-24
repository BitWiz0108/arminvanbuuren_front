import { DEFAULT_AVATAR_IMAGE } from "@/libs/constants";

export interface IUser {
  id: number | null;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  avatarImage: string;
  planId: number | null;
  planStartDate: string | null;
  planEndDate: string | null;
  status: boolean | null;
  googleId: string;
  appleId: string;
  facebookId: string;
  roleId: number | null;
  role: {
    id: number | null;
    name: string;
  };
}

export const DEFAULT_USER = {
  id: null,
  email: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  avatarImage: DEFAULT_AVATAR_IMAGE,
  planId: null,
  planStartDate: "",
  planEndDate: "",
  status: false,
  googleId: "",
  appleId: "",
  facebookId: "",
  roleId: null,
  role: {
    id: null,
    name: "",
  },
} as IUser;
