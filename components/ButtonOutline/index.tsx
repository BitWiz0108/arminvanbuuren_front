import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  onClick: Function;
  icon?: any;
};

const ButtonOutline = ({ label, onClick, icon = null }: Props) => {
  return (
    <button
      className={twMerge(
        "inline-flex justify-center items-center w-full min-w-[280px] py-2 text-primary text-xl font-semibold border-4 border-primary hover:border-transparent rounded-lg outline-none focus:outline-none transition-all duration-300 cursor-pointer",
        icon ? "space-x-2" : "space-x-0"
      )}
      onClick={() => onClick()}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default ButtonOutline;
