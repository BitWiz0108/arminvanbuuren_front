import { durationLabel } from "@/libs/utils";

export const composeLyrics = (
  artistUsername: string,
  title: string,
  duration: number,
  description: string,
  lyrics: string
) => {
  return (
    <div className="w-full flex flex-col justify-start items-center space-y-5">
      <p className="text-primary text-center text-2xl">{title}</p>
      <p className="text-primary text-center text-base">{artistUsername}</p>
      <p className="text-secondary text-center text-sm">
        {durationLabel(duration)}
      </p>
      <div
        className="text-secondary text-center text-xs"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></div>
      <div
        className="none-tailwind"
        dangerouslySetInnerHTML={{
          __html: lyrics,
        }}
      ></div>
    </div>
  );
};

export const composeMetadata = (
  artistUsername: string,
  title: string,
  duration: number,
  description: string,
  lyrics: string
) => {
  return (
    <div className="w-full flex flex-col justify-start items-center space-y-5">
      <p className="text-primary text-center text-xl">{artistUsername}</p>
      <p className="text-primary text-center text-2xl">{title}</p>
      <div
        className="text-secondary text-center text-xs"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></div>
      <p className="text-secondary text-center text-sm">
        {durationLabel(duration)}
      </p>
      <div
        className="none-tailwind"
        dangerouslySetInnerHTML={{
          __html: lyrics,
        }}
      ></div>
    </div>
  );
};
