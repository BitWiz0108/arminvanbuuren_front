import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

import { useSizeValues } from "@/contexts/contextSize";

type Props = {
  active: boolean;
  collapsed: boolean;
  icon: any;
  label: string;
  onClick: Function;
  lastOne?: boolean;
};

const ButtonSidebar = ({
  active,
  collapsed,
  icon,
  label,
  onClick,
  lastOne = false,
}: Props) => {
  const { isMobile } = useSizeValues();

  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = () => {
    if (hovered) return;
    setHovered(true);
  };

  const onOut = () => {
    if (!hovered) return;
    setHovered(false);
  };

  return (
    <div
      className={twMerge(
        "relative w-full h-[48px] lg:h-[58px] flex flex-row justify-start items-center overflow-hidden cursor-pointer",
        collapsed ? "pl-6" : "pl-6 lg:pl-10",
        isMobile
          ? ""
          : lastOne
          ? "border-t-[0.1rem] border-b-[0.1rem] border-[#464646]"
          : "border-t-[0.1rem] border-[#464646]"
      )}
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
      onClick={() => onClick()}
    >
      <div className="space-x-5 lg:space-x-6 flex justify-center items-center z-10">
        <div className="w-8 h-8 flex justify-start items-center">{icon}</div>
        {!collapsed && <span className="hidden md:inline-flex">{label}</span>}
      </div>
      {active ? (
        <div className="absolute -left-[20%] top-0 w-[130%] h-full bg-gradient-to-r from-transparent from-0% via-[#0e1959] via-10% to-[#273ccd] to-100% shadow-inner shadow-black/60 z-0"></div>
      ) : (
        <AnimatePresence>
          {hovered && (
            <motion.div
              className={twMerge(
                "absolute left-0 top-0 w-[130%] h-full bg-gradient-to-r from-transparent from-0% via-[#0e1959] via-10% to-[#273ccd] to-100% shadow-inner shadow-black/60",
                "z-0"
              )}
              initial={{ x: "120%" }}
              animate={{ x: "-20%" }}
              exit={{ x: "120%" }}
              transition={{ duration: 0.4 }}
            ></motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ButtonSidebar;
