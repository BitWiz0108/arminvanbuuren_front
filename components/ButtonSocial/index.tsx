import { twMerge } from "tailwind-merge";

type Props = {
  icon?: any;
  onClick?: Function;
  color?: string;
};

const ButtonSocial = ({ icon, onClick, color }: Props) => {
  return (
    <button className={twMerge(`p-5 outline-1 bg-[${color}] rounded-xl`)}>{icon}</button>
  );
}

export default ButtonSocial;