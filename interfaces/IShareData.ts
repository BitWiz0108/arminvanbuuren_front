import { SITE_BASE_URL } from "@/libs/constants";

export interface IShareData {
  url: string;
  title: string;
  subject: string;
  quote: string;
  about: string;
  body: string;
  summary: string;
  hashtag: string;
  hashtags: Array<string>;
  source: string;
  separator: string;
  related: Array<string>;
}

export const DEFAULT_SHAREDATA = {
  url: SITE_BASE_URL,
  title: "Armin Van Buuren Music",
  subject: "Armin Van Buuren Music",
  quote: "Armin Van Buuren Music",
  about: "Armin Van Buuren Music",
  body: "Armin Van Buuren Music",
  summary: "Armin Van Buuren Music",
  hashtag: "arminvanbuuren",
  hashtags: ["arminvanbuuren"],
  source: "arminvanbuuren.io",
  separator: "\n",
  related: ["@arminvanbuuren"],
} as IShareData;
