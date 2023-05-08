import { twJoin } from "tailwind-merge";

type Props = {
  icon: any;
  dark: boolean;
  size: "small" | "big" | "large";
  onClick: Function;
  ref?: any;
};

const ButtonCircle = ({ icon, dark, size, onClick }: Props) => {
  return (
    <button
      className={twJoin(
        "rounded-full shadow-lg inline-flex justify-center items-center outline-none border-none focus:outline-none focus:border-none active:outline-none active:border-none transition-all duration-200",
        size == "small"
          ? "w-[36px] h-[36px] md:w-[50px] md:h-[50px] min-w-[36px] md:min-w-[50px]"
          : size == "big"
            ? "w-[55px] h-[55px] md:w-[65px] md:h-[65px] min-w-[55px] md:min-w-[65px]"
            : "w-[75px] h-[75px] md:w-[85px] md:h-[85px] min-w-[75px] md:min-w-[85px]",
        dark
          ? "bg-gradient-to-tl to-blueSecondary via-60% via-[#1139d2] from-50% from-[#363635] bg-size-200 bg-pos-100 hover:bg-pos-0"
          : "bg-gradient-to-tl to-[#1139d2] via-blueSecondary from-[#1233bb] bg-size-200 bg-pos-100 hover:bg-pos-0"
      )}
      onClick={() => onClick()}
    >
      {icon}
    </button>
  );
};

export default ButtonCircle;
