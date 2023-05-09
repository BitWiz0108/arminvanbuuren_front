import { APP_NAME, SITE_BASE_URL } from "@/libs/constants";

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
  title: `${APP_NAME} Music`,
  subject: `${APP_NAME} Music`,
  quote: `${APP_NAME} Music`,
  about: `${APP_NAME} Music`,
  body: `${APP_NAME} Music`,
  summary: `${APP_NAME} Music`,
  hashtag: APP_NAME.toLowerCase(),
  hashtags: [APP_NAME.toLowerCase()],
  source: SITE_BASE_URL,
  separator: "\n",
  related: [`@${APP_NAME.toLowerCase()}`],
} as IShareData;
