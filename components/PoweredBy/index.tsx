import Image from "next/image";

const PoweredBy = () => {
  return (
    <div className="w-full flex flex-row justify-center items-center space-x-2">
      <span className="text-primary text-xs text-center">POWERED BY</span>
      <Image
        className="w-[114px] h-[19px]"
        src="/images/TM.png"
        width={114}
        height={19}
        alt=""
      />
    </div>
  );
};

export default PoweredBy;
