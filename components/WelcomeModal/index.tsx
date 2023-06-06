import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import { BROWSER_TYPE } from "@/libs/constants";

import { IArtist } from "@/interfaces/IArtist";

type Props = {
  isVisible: boolean;
  setVisible: Function;
  artist: IArtist;
};

const WelcomeModal = ({ isVisible, setVisible, artist }: Props) => {
  const { audioPlayer } = useShareValues();
  const { isMobile, setBrowserType } = useSizeValues();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={twMerge(
            "fixed left-0 top-0 w-screen h-screen p-5 bg-[#000000aa] flex justify-center items-center z-50",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
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
                onClick={() => {
                  setVisible(false);
                  setBrowserType(BROWSER_TYPE.OTHER);
                  audioPlayer.play();
                }}
              />
            </div>

            <h3 className="px-5 text-md text-center pt-10">
              Welcome To {artist.artistName} Official Fan Club. Watch private
              live streams, listen to his latest music and engage with&nbsp;
              {artist.artistName}
              &nbsp;fans.
            </h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeModal;
