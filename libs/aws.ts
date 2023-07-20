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

export const getRandomClientId = () => {
  return Math.random().toString(36).substring(2).toUpperCase();
};

export const printPeerConnectionStateInfo = async (
  event: any,
  logPrefix: any,
  remoteClientId: any
) => {
  const rtcPeerConnection = event.target;
  console.debug(
    logPrefix,
    "PeerConnection state:",
    rtcPeerConnection.connectionState
  );
  if (rtcPeerConnection.connectionState === "connected") {
    console.log(logPrefix, "Connection to peer successful!");
    const stats = await rtcPeerConnection.getStats();
    if (!stats) return;

    rtcPeerConnection.getSenders().map((sender: any) => {
      const trackType = sender.track?.kind;
      if (sender.transport) {
        const iceTransport = sender.transport.iceTransport;
        const logSelectedCandidate = () =>
          console.debug(
            `Chosen candidate pair (${trackType || "unknown"}):`,
            iceTransport.getSelectedCandidatePair()
          );
        iceTransport.onselectedcandidatepairchange = logSelectedCandidate;
        logSelectedCandidate();
      } else {
        console.error("Failed to fetch the candidate pair!");
      }
    });
  } else if (rtcPeerConnection.connectionState === "failed") {
    if (remoteClientId) {
      // removeViewerTrackFromMaster(remoteClientId);
    }
    console.error(
      logPrefix,
      `Connection to ${remoteClientId || "peer"} failed!`
    );
  }
};
