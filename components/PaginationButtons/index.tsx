import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  width?: number;
  onClick: Function;
  bgColor?: string;
};

const PaginationButtons = ({ label, onClick, bgColor }: Props) => {
  return (
    <button
      className={twMerge(
        `inline-flex font-semibold justify-center w-full bg-[${bgColor}] items-center text-primary text-sm px-2 py-0.5 mt-5 rounded-md transition-all duration-300 cursor-pointer bg-transparent`
      )}
      onClick={() => onClick()}
    >
      <span>{label}</span>
    </button>
  );
};

export default PaginationButtons;
