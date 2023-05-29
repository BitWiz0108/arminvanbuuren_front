import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

const LyricView = () => {
  const { isLyricsVisible, setIsLyricsVisible, lyrics } = useShareValues();
  const { isMobile } = useSizeValues();

  return (
    <AnimatePresence>
      {isLyricsVisible && (
        <motion.div
          className={twMerge(
            "fixed left-0 top-0 w-screen h-screen pb-24 lg:pb-32 bg-[#000000aa] flex justify-center items-center z-40",
            isMobile ? "bg-background pb-[180px]" : "pb-28 lg:pb-36"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[540px] h-full md:h-4/5 pt-20 pb-5 md:pb-10 bg-background rounded-none md:rounded-lg">
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => setIsLyricsVisible(false)}
              />
            </div>
            <div className="w-full h-full overflow-x-hidden overflow-y-auto px-5">
              {lyrics}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LyricView;
