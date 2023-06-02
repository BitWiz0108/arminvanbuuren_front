import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useShareData from "@/hooks/useShareData";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { DEFAULT_SHAREDATA, IShareData } from "@/interfaces/IShareData";
import { DEFAULT_ARTIST } from "@/interfaces/IArtist";

export const ShareContext = createContext({
  artist: DEFAULT_ARTIST,
  audioPlayer: {} as IAudioPlayer,
  isLyricsVisible: false,
  setIsLyricsVisible: (flag: boolean) => {},
  lyrics: null as any,
  setLyrics: (value: any) => {},
  isMetaVisible: false,
  setIsMetaVisible: (flag: boolean) => {},
  metaData: null as any,
  setMetaData: (value: any) => {},
  isSubscriptionModalVisible: false,
  setIsSubscriptionModalVisible: (flag: boolean) => {},
  isViewExclusiveModalVisible: false,
  setIsViewExclusiveModalVisible: (flag: boolean) => {},
  isDonationModalVisible: false,
  setIsDonationModalVisible: (flag: boolean) => {},
  isLivestreamCommentVisible: false,
  setIsLivestreamCommentVisible: (flag: boolean) => {},
  isShareModalVisible: false,
  setIsShareModalVisible: (flag: boolean) => {},
  shareData: DEFAULT_SHAREDATA,
  setShareData: (value: IShareData) => {},
  paypalClientId: "",
  stripePublicApiKey: "",
});

export const ShareProvider = ({ children }: { children: ReactNode }) => {
  const {
    artist,
    audioPlayer,
    isLyricsVisible,
    setIsLyricsVisible,
    lyrics,
    setLyrics,
    isMetaVisible,
    setIsMetaVisible,
    metaData,
    setMetaData,
    isSubscriptionModalVisible,
    setIsSubscriptionModalVisible,
    isViewExclusiveModalVisible,
    setIsViewExclusiveModalVisible,
    isDonationModalVisible,
    setIsDonationModalVisible,
    isLivestreamCommentVisible,
    setIsLivestreamCommentVisible,
    isShareModalVisible,
    setIsShareModalVisible,
    shareData,
    setShareData,
    paypalClientId,
    stripePublicApiKey,
  } = useShareData();

  return (
    <ShareContext.Provider
      value={{
        artist,
        audioPlayer,
        isLyricsVisible,
        setIsLyricsVisible,
        lyrics,
        setLyrics,
        isMetaVisible,
        setIsMetaVisible,
        metaData,
        setMetaData,
        isSubscriptionModalVisible,
        setIsSubscriptionModalVisible,
        isViewExclusiveModalVisible,
        setIsViewExclusiveModalVisible,
        isDonationModalVisible,
        setIsDonationModalVisible,
        isLivestreamCommentVisible,
        setIsLivestreamCommentVisible,
        isShareModalVisible,
        setIsShareModalVisible,
        shareData,
        setShareData,
        paypalClientId,
        stripePublicApiKey,
      }}
    >
      {children}
    </ShareContext.Provider>
  );
};

export const useShareValues = () => useContext(ShareContext);

ShareProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
