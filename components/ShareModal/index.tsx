import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  InstapaperShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
} from "react-share";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

import X from "@/components/Icons/X";

import { useShareValues } from "@/contexts/contextShareData";

import { SITE_BASE_URL } from "@/libs/constants";

const ShareModal = () => {
  const router = useRouter();
  const currentUrl = `${SITE_BASE_URL}` + router.asPath;

  const { isShareModalVisible, setIsShareModalVisible, shareData } =
    useShareValues();

  return (
    <AnimatePresence>
      {isShareModalVisible && (
        <motion.div
          className="fixed left-0 top-0 w-screen h-screen p-5 bg-[#000000aa] flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[420px] bg-background h-fit flex flex-col justify-start items-center p-5 rounded-lg">
            <div className="absolute top-6 right-5 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => setIsShareModalVisible(false)}
              />
            </div>

            <h1 className="w-full text-left text-primary text-xl">Share</h1>

            <div className="border-t border-secondary pt-5 mt-5 w-full flex justify-center items-center flex-wrap gap-8 md:gap-12">
              <FacebookShareButton
                url={shareData.url}
                quote={shareData.title}
                about={shareData.about}
                hashtag={shareData.hashtag}
              >
                <FacebookIcon borderRadius={8} size={36} />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                hashtags={shareData.hashtags}
                related={shareData.related}
              >
                <TwitterIcon borderRadius={8} size={36} />
              </TwitterShareButton>
              <LinkedinShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                summary={shareData.about}
                source={shareData.source}
              >
                <LinkedinIcon borderRadius={8} size={36} />
              </LinkedinShareButton>
              <EmailShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                subject={shareData.title}
                body={shareData.about}
                separator={shareData.separator}
              >
                <EmailIcon borderRadius={8} size={36} />
              </EmailShareButton>
            </div>
            <div className="w-4/5 flex flex-row bg-white mt-4 rounded-xl">
              <p className="relative p-1 text-sm bg-white text-bluePrimary underline rounded-xl" >{currentUrl}</p>
              <p className="absolute p-1 right-14 bg-bluePrimary text-sm text-white cursor-pointer rounded-xl" onClick={() => { navigator.clipboard.writeText(currentUrl); toast.success("Link copied to the clipboard.") }}> Copy Link </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
