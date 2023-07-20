import { useState, useRef } from "react";

import ButtonSettings from "@/components/ButtonSettings";
import TextInput from "@/components/TextInput";
import Layout from "@/components/Layout";
import Loading from "@/components/Loading";

import { getRandomClientId } from "@/libs/aws";

import ViewerConnection from "@/interfaces/ViewerConnection";

const LivestreamClient = () => {
  const remoteViewRef = useRef<HTMLVideoElement>(null);

  const [channelName, setChannelName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const viewerConnection = new ViewerConnection();

  const onStart = async () => {
    setIsLoading(true);
    const result = await viewerConnection.startViewer(
      remoteViewRef.current!,
      channelName,
      getRandomClientId(),
      true,
      (event: any) => {
        console.log(`Message: ${event.data}\n`);
      }
    );
    setIsConnected(result);
    setIsLoading(false);
  };

  const onStop = () => {
    setIsConnected(!viewerConnection.stopViewer());
  };

  return (
    <Layout>
      <div className="realtive w-screen flex flex-col justify-start items-center">
        <div className="w-full flex justify-center items-center">
          <div className="w-full md:w-1/2 flex flex-col justify-start items-center p-2 space-y-2">
            <TextInput
              sname="Channel Name"
              label=""
              placeholder="Channel Name"
              type="text"
              value={channelName}
              setValue={setChannelName}
            />

            {channelName && (
              <div className="w-full flex justify-start items-center space-x-2">
                {isConnected ? (
                  <ButtonSettings
                    disabled={isLoading}
                    label="Stop Viewer"
                    bgColor={"1"}
                    onClick={onStop}
                  />
                ) : (
                  <ButtonSettings
                    disabled={isLoading}
                    label="Start Viewer"
                    bgColor={"1"}
                    onClick={onStart}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <video
          ref={remoteViewRef}
          className="w-full"
          autoPlay
          playsInline
          controls
        />

        {isLoading && (
          <div className="loading">
            <Loading width={64} height={64} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LivestreamClient;
