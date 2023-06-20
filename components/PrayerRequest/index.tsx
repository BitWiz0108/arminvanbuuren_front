import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Comment from "@/components/Icons/Comment";
import HeartFill from "@/components/Icons/HeartFill";
import Heart from "@/components/Icons/Heart";
import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";

import { bigNumberFormat } from "@/libs/utils";

import { useAuthValues } from "@/contexts/contextAuth";

type Props = {
  prayerRequest: IPrayerRequest;
  favorite: Function;
  DeletePrayerRequest: Function;
  EditPrayerRequest: Function;
  comment: Function;
};

const PrayerRequest = ({
  prayerRequest,
  favorite,
  DeletePrayerRequest,
  EditPrayerRequest,
  comment,
}: Props) => {
  const { accessToken, user } = useAuthValues();
  const [isSeenMore, setIsSeenMore] = useState<boolean>(false);

  return (
    <div className="w-full flex flex-col justify-start items-start space-y-2 p-3 rounded-lg bg-third">
      <p
        className={twMerge("w-full text-left text-base lg:text-lg font-medium")}
      >
        {prayerRequest.isAnonymous
          ? "Anonymous"
          : prayerRequest.author.firstName +
            " " +
            prayerRequest.author.lastName}
      </p>
      <p
        className={twMerge(
          "w-full text-left text-sm lg:text-base font-medium transition-all duration-300 cursor-pointer",
          isSeenMore
            ? "text-blueSecondary"
            : "text-primary hover:text-blueSecondary"
        )}
        onClick={() => comment()}
      >
        {prayerRequest.title}
      </p>

      <div className={twMerge("relative w-full", isSeenMore ? "pb-5" : "pb-0")}>
        <div
          className={twMerge(
            "relative w-full  text-sm",
            isSeenMore
              ? "text-primary h-fit"
              : "text-secondary max-h-[22px] overflow-hidden"
          )}
          dangerouslySetInnerHTML={{
            __html: prayerRequest.content,
          }}
        ></div>
        {prayerRequest.author.id == user.id ? (
          <div>
            <div className="absolute bottom-0 right-20 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none">
              <Edit
                width={24}
                height={24}
                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                onClick={() => {
                  EditPrayerRequest(prayerRequest.id);
                }}
              />
            </div>
            <div className="absolute bottom-0 right-32 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none">
              <Delete
                width={24}
                height={24}
                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                onClick={() => {
                  DeletePrayerRequest(prayerRequest.id);
                }}
              />
            </div>
          </div>
        ) : (
          ""
        )}

        {isSeenMore ? (
          <div
            className="absolute bottom-0 right-0 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none"
            onClick={() => setIsSeenMore(false)}
          >
            <b>Less</b>...
          </div>
        ) : (
          <div
            className="absolute top-0 right-0 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none"
            onClick={() => setIsSeenMore(true)}
          >
            ...<b>See more</b>
          </div>
        )}
      </div>

      <div className="w-full flex flex-wrap justify-center items-center">
        <div
          className="min-w-[100px] w-1/2 p-2 flex justify-center items-center space-x-2 text-secondary hover:text-primary hover:bg-background rounded-md cursor-pointer transition-all duration-300"
          onClick={() => favorite()}
        >
          {prayerRequest.isPraying ? (
            <HeartFill width={18} height={18} />
          ) : (
            <Heart width={18} height={18} />
          )}
          <span className="text-sm md:text-base select-none">
            Pray for this person&nbsp;
            <span className="text-xs">
              ({bigNumberFormat(prayerRequest.numberOfPrays)})
            </span>
          </span>
        </div>
        <div
          className="min-w-[100px] w-1/2 p-2 flex justify-center items-center space-x-2 text-secondary hover:text-primary hover:bg-background rounded-md cursor-pointer transition-all duration-300"
          onClick={() => comment()}
        >
          <Comment width={18} height={18} />
          <span className="text-sm md:text-base select-none">
            Reply to&nbsp;
            {prayerRequest.isAnonymous
              ? "Anonymous"
              : prayerRequest.author.firstName +
                " " +
                prayerRequest.author.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PrayerRequest;
