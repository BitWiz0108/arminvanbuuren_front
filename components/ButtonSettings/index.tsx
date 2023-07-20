import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  onClick: Function;
  bgColor?: string;
  disabled?: boolean;
};

const ButtonSettings = ({
  label,
  onClick,
  bgColor,
  disabled = false,
}: Props) => {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        "inline-flex font-semibold justify-center w-full items-center text-primary text-xl px-3 py-3 rounded-md transition-all duration-300 cursor-pointer disabled:bg-gray-700 disabled:text-secondary",
        bgColor
          ? "bg-bluePrimary hover:bg-blueSecondary"
          : "bg-[#dc3545] hover:bg-[#ff5061]"
      )}
      onClick={() => onClick()}
    >
      <span>{label}</span>
    </button>
  );
};

export default ButtonSettings;
