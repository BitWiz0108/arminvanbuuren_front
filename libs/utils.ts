import { APP_TYPE, SYSTEM_TYPE } from "@/libs/constants";

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const checkContainsSpecialCharacters = (value: string) => {
  var regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
  return regex.test(value);
};

export const checkNumber = (value: string) => {
  if (value === "") return true;
  const reg = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
  return reg.test(value);
};

export const durationLabel = (duration: number) => {
  if (duration == null || duration == undefined || duration == 0) return "";

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

export const bigNumberFormat = (num: number, digits: number = 0) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const generateRandomNumber = () => {
  const min = 1; // Minimum number you want to generate
  const max = 100; // Maximum number you want to generate
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

export const getRandomIndex = (max: number) => {
  return Math.floor(Math.random() * (max + 1));
};

export const getUrlFormattedTitle = (
  asset: any,
  type: "livestream" | "music" | "post"
) => {
  if (!asset) {
    switch (type) {
      case "livestream":
        return "/livestreams";
      case "music":
        if (SYSTEM_TYPE == APP_TYPE.CHURCH) {
          return "/audio";
        }
        return "/music";
      case "post":
        if (SYSTEM_TYPE == APP_TYPE.CHURCH) {
          return "/community";
        }
        return "/fanclub";
      default:
        return "/home";
    }
  }
  const title = asset.title as string;
  switch (type) {
    case "livestream":
      return `/livestream/${title.trim().replaceAll(" ", "-").toLowerCase()}`;
    case "music":
      return `/album/${title.trim().replaceAll(" ", "-").toLowerCase()}`;
    case "post":
      return `/post/${title.trim().replaceAll(" ", "-").toLowerCase()}`;
    default:
      return "/home";
  }
};
