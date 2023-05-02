import AWS from "aws-sdk";

import {
  ASSET_TTL,
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
} from "@/libs/constants";

const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

export const getAWSSignedURL = (asset: string, defaultValue: string = "") => {
  return new Promise<string>((resolve, _) => {
    if (asset == "" || asset == undefined || asset == null) {
      resolve(defaultValue);
      return;
    }

    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: getAWSObjectKey(asset),
      Expires: ASSET_TTL,
    };

    s3.getSignedUrl("getObject", params, (e, url) => {
      if (e) {
        console.log(e);
        resolve(defaultValue);
        return;
      }

      resolve(url);
    });
  });
};

export const getAWSObjectKey = (asset: string) => {
  if (asset == "" || asset == undefined || asset == null) return "";

  if (asset.includes("https://")) {
    const regex = /^https?:\/\/[^/]+\/(.*)$/;
    const matches = asset.match(regex);

    if (matches && matches.length > 1) {
      return matches[1];
    } else {
      return asset;
    }
  }
  return asset;
};
