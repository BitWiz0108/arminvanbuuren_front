import { IStream } from "@/interfaces/IStream";

type Props = {
  track: IStream;
};

const LiveStreamPreview = ({ track }: Props) => {
  return (
    <video
      loop
      muted
      autoPlay
      playsInline
      className="relative w-full h-full object-cover z-0"
      src={track.previewVideo}
    ></video>
  );
};
export default LiveStreamPreview;
