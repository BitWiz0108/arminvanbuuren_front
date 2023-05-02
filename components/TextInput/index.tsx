import { useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
  value: string;
  setValue: Function;
  icon?: any;
  sname?: string;
  id?: string;
};

const Input = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  sname,
  id,
  icon = null,
}: Props) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onChange = (value: string) => {
    setValue(value);
    setDirty(true);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start my-2 space-y-1">
      <label htmlFor={id} className="w-full text-left text-sm">
        {sname}
      </label>
      <div
        className={twMerge(
          "w-full flex flex-row bg-background justify-start items-center py-4 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg transition-all duration-300",
          icon ? "space-x-2" : "space-x-0"
        )}
      >
        {icon}
        <input
          type={type}
          id={id}
          className="flex w-auto flex-grow text-primary text-sm bg-transparent outline-none border-none focus:outline-none focus:border-none"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {icon && <div className="w-5"></div>}
      </div>
    </div>
  );
};

export default Input;
