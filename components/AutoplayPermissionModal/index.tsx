import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";

import { useSizeValues } from "@/contexts/contextSize";

import { BROWSER_TYPE } from "@/libs/constants";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { IVideoPlayer } from "@/interfaces/IVideoPlayer";

type Props = {
  isVisible: boolean;
  setVisible: Function;
  player: IAudioPlayer | IVideoPlayer;
};

const AutoplayPermissionModal = ({ isVisible, setVisible, player }: Props) => {
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
                  player.play();
                }}
              />
            </div>

            <h3 className="px-5 text-md text-center pt-10">
              Please be aware that our website would play music in background.
            </h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoplayPermissionModal;
