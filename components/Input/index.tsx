import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  label: string;
  placeholder: string;
  type: "text" | "email" | "number" | "password";
  value: string;
  setValue: Function;
  icon?: any;
  onKeyDown?: Function | null;
};

const Input = ({
  label,
  placeholder,
  type,
  value,
  setValue,
  icon = null,
  onKeyDown = null,
}: Props) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [dirty, setDirty] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onChange = (value: string) => {
    setValue(value);
    setDirty(true);
  };

  useEffect(() => {
    if (dirty && value == "") {
      setError(true);
    } else {
      setError(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, dirty]);

  return (
    <div
      className={twMerge(
        "w-full h-300px flex flex-row justify-start items-center py-2 border-b-2 border-primary transition-all duration-300",
        error
          ? "border-error"
          : focus
          ? "border-activePrimary"
          : "border-primary",
        icon ? "space-x-2" : "space-x-0"
      )}
    >
      {icon}
      <input
        type={type}
        className="flex w-auto flex-grow text-primary text-center text-xl placeholder-primary bg-transparent outline-none border-none focus:outline-none focus:border-none"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onKeyDown={(e) => {
          if (onKeyDown) {
            onKeyDown(e);
          }
        }}
      />
      {icon && <div className="w-5"></div>}
    </div>
  );
};

export default Input;
