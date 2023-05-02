import { twMerge } from "tailwind-merge";
import DatePicker from "react-datepicker";
import moment from "moment";

import { DATETIME_FORMAT, US_DATETIME_FORMAT } from "@/libs/constants";

type Props = {
  label: string;
  placeholder: string;
  value: string;
  setValue: Function;
  sname?: string;
  id?: string;
};

const DateInput = ({
  label,
  placeholder,
  value,
  setValue,
  sname,
  id,
}: Props) => {
  return (
    <div className="w-full py-2 flex flex-col space-y-1">
      <label htmlFor={id} className="w-full text-sm">
        {sname}
      </label>
      <div
        className={twMerge(
          "w-full flex flex-row bg-background justify-start items-center py-3.5 font-semibold px-4 border-[0.0625rem] border-[#3e454d] rounded-lg transition-all duration-300"
        )}
      >
        <DatePicker
          className="w-full flex text-primary text-sm placeholder-secondary bg-transparent outline-none border-none focus:outline-none focus:border-none"
          selected={value ? moment(value).toDate() : new Date()}
          onChange={(date) => setValue(moment(date).format(DATETIME_FORMAT))}
          dateFormat={US_DATETIME_FORMAT}
          placeholderText={placeholder}
        />
      </div>
    </div>
  );
};

export default DateInput;
