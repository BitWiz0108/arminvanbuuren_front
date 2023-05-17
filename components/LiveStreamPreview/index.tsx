import VideoPlayer from "@/components/VideoPlayer";

import { IStream } from "@/interfaces/IStream";

type Props = {
  track: IStream;
};

const LiveStreamPreview = ({ track }: Props) => {
  return (
    <VideoPlayer
      loop
      muted
      autoPlay
      playsInline
      className="relative w-full h-full object-cover z-0"
      src={track.previewVideo}
    />
  );
};
export default LiveStreamPreview;
