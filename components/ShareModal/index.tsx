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
import { AnimatePresence, motion } from "framer-motion";

import X from "@/components/Icons/X";

import { useShareValues } from "@/contexts/contextShareData";

const ShareModal = () => {
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
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => setIsShareModalVisible(false)}
              />
            </div>

            <h1 className="w-full text-left text-primary text-xl">Share</h1>

            <div className="border-t border-secondary pt-5 mt-5 w-full flex justify-center items-center flex-wrap gap-5 md:gap-10">
              <FacebookShareButton
                url={shareData.url}
                quote={shareData.title}
                about={shareData.about}
                hashtag={shareData.hashtag}
              >
                <FacebookIcon borderRadius={8} size={50} />
              </FacebookShareButton>
              <TwitterShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                hashtags={shareData.hashtags}
                related={shareData.related}
              >
                <TwitterIcon borderRadius={8} size={50} />
              </TwitterShareButton>
              <LinkedinShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                summary={shareData.about}
                source={shareData.source}
              >
                <LinkedinIcon borderRadius={8} size={50} />
              </LinkedinShareButton>
              <EmailShareButton
                url={shareData.url}
                title={shareData.title}
                about={shareData.about}
                subject={shareData.title}
                body={shareData.about}
                separator={shareData.separator}
              >
                <EmailIcon borderRadius={8} size={50} />
              </EmailShareButton>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
