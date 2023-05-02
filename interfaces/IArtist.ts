import {
  DEFAULT_ARTIST_IMAGE,
  DEFAULT_BANNER_IMAGE,
  DEFAULT_COVER_IMAGE,
  DEFAULT_LOGO_IMAGE,
} from "@/libs/constants";

export interface IArtist {
  username: string;
  artistName: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  website: string;
  numberOfFans: number;
  numberOfMusics: number;
  numberOfLivestreams: number;
  description: string;
  albumNames: Array<string>;
  address: string;
  bannerImage: string;
  avatarImage: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
  soundcloud: string;
  logoImage: string;
}

export const DEFAULT_ARTIST = {
  username: "",
  artistName: "",
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  website: "",
  numberOfFans: 0,
  numberOfMusics: 0,
  numberOfLivestreams: 0,
  description: "",
  albumNames: [],
  address: "",
  bannerImage: DEFAULT_BANNER_IMAGE,
  avatarImage: DEFAULT_ARTIST_IMAGE,
  facebook: "",
  twitter: "",
  instagram: "",
  youtube: "",
  soundcloud: "",
  logoImage: DEFAULT_LOGO_IMAGE,
} as IArtist;
