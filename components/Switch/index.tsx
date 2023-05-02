import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  checked: boolean;
  setChecked: Function;
  labelPos: "top" | "bottom" | "left" | "right";
};

const Switch = ({ label, checked, setChecked, labelPos }: Props) => {
  return (
    <div
      className={twMerge(
        "flex justify-start items-center",
        labelPos == "top" || labelPos == "bottom"
          ? "flex-col space-y-2"
          : "flex-row space-x-2"
      )}
    >
      {(labelPos == "top" || labelPos == "left") && (
        <label
          htmlFor="checkbox"
          className="text-sm md:text-base lg:text-lg text-primary text-center"
        >
          {label}
        </label>
      )}

      <input
        id="checkbox"
        type="checkbox"
        className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <div
        className={twMerge(
          "w-9 h-5 lg:w-14 lg:h-7 rounded-full overflow-hidden p-0.5 transition-all duration-300",
          checked ? "bg-activePrimary" : "bg-activeSecondary"
        )}
      >
        <div
          className={twMerge(
            "w-4 h-4 lg:w-6 lg:h-6 rounded-full bg-white overflow-hidden transition-all duration-300",
            checked ? "ml-[52%] mr-0.5" : "mr-[52%] ml-0.5"
          )}
        ></div>
      </div>

      {(labelPos == "bottom" || labelPos == "right") && (
        <label
          htmlFor="checkbox"
          className="text-sm md:text-base lg:text-lg text-primary text-center"
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Switch;
