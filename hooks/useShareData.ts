import { useState, useEffect } from "react";

import useAudioPlayer from "@/hooks/useAudioplayer";

import { useAuthValues } from "@/contexts/contextAuth";

import useFanclub from "@/hooks/useFanclub";
import useMusic from "@/hooks/useMusic";
import useTransaction from "@/hooks/useTransaction";

import { PAYPAL_CLIENT_ID, STRIPE_PUBLICK_API_KEY } from "@/libs/constants";

import { DEFAULT_SHAREDATA, IShareData } from "@/interfaces/IShareData";
import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";

const useShareData = () => {
  const { isSignedIn } = useAuthValues();
  const { fetchArtist } = useFanclub();
  const { fetchMusics } = useMusic();
  const { fetchPaymentData } = useTransaction();

  const audioPlayer = useAudioPlayer();

  const [artist, setArtist] = useState<IArtist>(DEFAULT_ARTIST);

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

  const [paypalClientId, setPaypalClientId] =
    useState<string>(PAYPAL_CLIENT_ID);
  const [stripePublicApiKey, setStripePublicApiKey] = useState<string>(
    STRIPE_PUBLICK_API_KEY
  );
  const [shareData, setShareData] = useState<IShareData>(DEFAULT_SHAREDATA);

  useEffect(() => {
    if (isSignedIn) {
      fetchMusics(1, false).then((value) => {
        if (value.musics.length > 0) {
          audioPlayer.setMusics(value.musics);
        }
      });

      fetchPaymentData().then((data) => {
        if (data) {
          setPaypalClientId(
            !data.paypalClientId || data.paypalClientId == "PAYPAL_CLIENT_ID"
              ? PAYPAL_CLIENT_ID
              : data.paypalClientId
          );
          setStripePublicApiKey(
            !data.stripePublicApiKey ||
              data.stripePublicApiKey == "STRIPE_PUBLIC_API_KEY"
              ? STRIPE_PUBLICK_API_KEY
              : data.stripePublicApiKey
          );
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  useEffect(() => {
    fetchArtist().then((value) => {
      if (value) {
        setArtist(value);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
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
    paypalClientId,
    stripePublicApiKey,
  };
};

export default useShareData;
