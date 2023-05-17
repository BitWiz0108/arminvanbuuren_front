import {
  DEFAULT_AVATAR_IMAGE,
  DEFAULT_LOGO_IMAGE,
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
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
  mobile: string;
  bannerType: FILE_TYPE;
  bannerImage: string;
  bannerImageCompressed: string;
  bannerVideo: string;
  bannerVideoCompressed: string;
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
  mobile: "",
  bannerType: FILE_TYPE.IMAGE,
  bannerImage: IMAGE_BLUR_DATA_URL,
  bannerImageCompressed: IMAGE_BLUR_DATA_URL,
  bannerVideo: "",
  bannerVideoCompressed: "",
  avatarImage: DEFAULT_AVATAR_IMAGE,
  facebook: "",
  twitter: "",
  instagram: "",
  youtube: "",
  soundcloud: "",
  logoImage: DEFAULT_LOGO_IMAGE,
} as IArtist;
