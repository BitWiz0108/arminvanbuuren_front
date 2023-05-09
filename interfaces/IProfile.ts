import { DEFAULT_AVATAR_IMAGE, GENDER } from "@/libs/constants";

export interface IProfile {
  id: number | null;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarImage: string;
  gender: string;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export const DEFAULT_PROFILE = {
  id: null,
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  avatarImage: DEFAULT_AVATAR_IMAGE,
  gender: GENDER.MALE,
  dob: "1960-01-01",
  address: "",
  country: "",
  state: "",
  city: "",
  zipcode: "",
} as IProfile;
