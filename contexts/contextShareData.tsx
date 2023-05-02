import { createContext, useContext, ReactNode } from "react";
import PropTypes from "prop-types";

import useShareData from "@/hooks/useShareData";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { DEFAULT_SHAREDATA, IShareData } from "@/interfaces/IShareData";

export const ShareContext = createContext({
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
});

export const ShareProvider = ({ children }: { children: ReactNode }) => {
  const {
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
  } = useShareData();

  return (
    <ShareContext.Provider
      value={{
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
