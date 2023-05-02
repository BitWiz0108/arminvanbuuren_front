import { DEFAULT_AVATAR_IMAGE, GENDER } from "@/libs/constants";

import { DEFAULT_COUNTRY, ICountry } from "@/interfaces/ICountry";
import { DEFAULT_STATE, IState } from "@/interfaces/IState";
import { DEFAULT_CITY, ICity } from "@/interfaces/ICity";

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
  country: ICountry;
  state: IState;
  city: ICity;
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
  country: DEFAULT_COUNTRY,
  state: DEFAULT_STATE,
  city: DEFAULT_CITY,
  zipcode: "",
} as IProfile;
