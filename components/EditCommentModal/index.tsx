import { useState, useEffect, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { toast } from "react-toastify";

import X from "@/components/Icons/X";
import Textarea from "@/components/Textarea";

import { useSizeValues } from "@/contexts/contextSize";

import { IComment } from "@/interfaces/IComment";

type Props = {
  comment: IComment | undefined | null;
  isVisible: boolean;
  setVisible: Function;
  editComment: Function;
};

const EditCommentModal = ({
  comment,
  isVisible,
  setVisible,
  editComment,
}: Props) => {
  const { isMobile } = useSizeValues();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (comment) setContent(comment.content);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, comment]);

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
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>

            <h1 className="w-full text-left text-primary text-xl">
              Edit Comment
            </h1>

            <div className="border-t border-secondary pt-5 mt-5 mb-2 w-full flex justify-center items-center flex-wrap gap-8 md:gap-12">
              <Textarea
                label=""
                placeholder="Message"
                type="text"
                value={content}
                setValue={setContent}
              />
            </div>
            <button
              className="w-full h-10 inline-flex justify-center items-center space-x-2 bg-bluePrimary hover:bg-blueSecondary text-primary rounded-md transition-all duration-300"
              onClick={() => {
                if (!content) {
                  toast.warn("Please type comment correctly.");
                  return;
                }
                setVisible(false);
                editComment(comment?.id, content);
              }}
            >
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditCommentModal;
