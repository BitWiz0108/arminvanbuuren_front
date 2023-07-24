import { initializeApp, getApps } from "firebase/app";

import {
  APP_TYPE,
  FIREBASE_CONFIG,
  SYSTEM_TYPE,
  TRANSACTION_TYPE,
} from "@/libs/constants";

import { ITransaction } from "@/interfaces/ITransaction";

export const initializeFirebase = () => {
  try {
    let apps = getApps();
    if (!apps.length) {
      initializeApp(FIREBASE_CONFIG);
    }
    return apps;
  } catch (e) {
    console.log(e);
  }
  return null;
};

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

export const getTransactionAsset = (transaction: ITransaction) => {
  if (transaction.type == TRANSACTION_TYPE.DONATION) {
    if (transaction.musicId && transaction.music) {
      return `Music: ${transaction.music.title}`;
    }
    if (transaction.livestreamId && transaction.livestream) {
      return `Livestream: ${transaction.livestream.title}`;
    }
  } else if (transaction.type == TRANSACTION_TYPE.SUBSCRIPTION) {
    if (transaction.planId && transaction.plan) {
      return `Plan: ${transaction.plan.name}`;
    }
  }
  return transaction.orderId;
};

export const secondsToHHMMSS = (seconds: number) => {
  if (seconds == null || seconds == undefined || typeof seconds != "number")
    return "";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  let formattedTime = "";

  if (Number.isFinite(hours) && hours > 0) {
    formattedTime += hours.toString().padStart(2, "0") + ":";
  }

  if (Number.isFinite(minutes)) {
    formattedTime += minutes.toString().padStart(2, "0") + ":";
  } else {
    formattedTime += "00:";
  }

  if (Number.isFinite(remainingSeconds)) {
    formattedTime += remainingSeconds.toString().padStart(2, "0");
  } else {
    formattedTime += "00";
  }

  return formattedTime;
};
