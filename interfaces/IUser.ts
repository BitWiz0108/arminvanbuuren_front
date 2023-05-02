import { DEFAULT_AVATAR_IMAGE } from "@/libs/constants";

export interface IUser {
  id: number | null;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarImage: string;
  planId: number | null;
  planStartDate: string | null;
  planEndDate: string | null;
  status: boolean | null;
  roleId: number | null;
  role: {
    id: number | null;
    name: string;
  };
}

export const DEFAULT_USER = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  avatarImage: DEFAULT_AVATAR_IMAGE,
  planId: null,
  planStartDate: "",
  planEndDate: "",
  status: false,
  roleId: null,
  role: {
    id: null,
    name: "",
  },
} as IUser;
