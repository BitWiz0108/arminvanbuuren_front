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
        "inline-flex justify-center items-center w-[170px] min-w-[170px] h-[50px] min-h-[50px] py-2 text-primary text-sm border-2 border-primary hover:bg-blueSecondary hover:border-blueSecondary rounded-lg outline-none focus:outline-none transition-all duration-300 cursor-pointer",
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
