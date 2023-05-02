import { useState, useEffect } from "react";

import useAudioPlayer from "@/hooks/useAudioplayer";

import { useAuthValues } from "@/contexts/contextAuth";

import useMusic from "@/hooks/useMusic";

import { DEFAULT_SHAREDATA, IShareData } from "@/interfaces/IShareData";

const useShareData = () => {
  const { isSignedIn } = useAuthValues();
  const { fetchMusics } = useMusic();

  const audioPlayer = useAudioPlayer();

  const [isLyricsVisible, setIsLyricsVisible] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<any>(null);

  const [isMetaVisible, setIsMetaVisible] = useState<boolean>(false);
  const [metaData, setMetaData] = useState<any>(null);

  const [isLivestreamCommentVisible, setIsLivestreamCommentVisible] =
    useState<boolean>(false);

  const [isDonationModalVisible, setIsDonationModalVisible] =
    useState<boolean>(false);
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState<boolean>(false);
  const [isViewExclusiveModalVisible, setIsViewExclusiveModalVisible] =
    useState<boolean>(false);

  const [isShareModalVisible, setIsShareModalVisible] =
    useState<boolean>(false);
  const [shareData, setShareData] = useState<IShareData>(DEFAULT_SHAREDATA);

  useEffect(() => {
    fetchMusics(1, false).then((value) => {
      if (value.musics.length > 0) {
        audioPlayer.setMusics(value.musics);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return {
    audioPlayer,
    isLyricsVisible,
    setIsLyricsVisible,
    lyrics,
    setLyrics,
    isMetaVisible,
    setIsMetaVisible,
    metaData,
    setMetaData,
    isDonationModalVisible,
    setIsDonationModalVisible,
    isSubscriptionModalVisible,
    setIsSubscriptionModalVisible,
    isViewExclusiveModalVisible,
    setIsViewExclusiveModalVisible,
    isLivestreamCommentVisible,
    setIsLivestreamCommentVisible,
    isShareModalVisible,
    setIsShareModalVisible,
    shareData,
    setShareData,
  };
};

export default useShareData;
