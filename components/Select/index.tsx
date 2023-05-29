type Props = {
  label: string;
  value: string | number;
  setValue: Function;
  options: Array<{ value: string; label: string }>;
};

const Select = ({ label, value, setValue, options }: Props) => {
  return (
    <div className="w-full flex flex-col justify-start items-start my-2 space-y-1">
      <label htmlFor={label} className="text-sm">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full flex flex-row bg-background justify-start items-center h-14 py-3.5 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg outline-none focus:outline-none transition-all duration-300"
      >
        {options.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
