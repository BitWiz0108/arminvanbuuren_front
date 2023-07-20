import { toast } from "react-toastify";
import * as AWS from "aws-sdk";
import * as KVSWebRTC from "amazon-kinesis-video-streams-webrtc";
import {
  AWS_ACCESS_KEY_ID,
  AWS_REGION,
  AWS_SECRET_ACCESS_KEY,
} from "@/libs/constants";
import { printPeerConnectionStateInfo } from "@/libs/aws";

class ViewerConnection {
  private viewer: Viewer = {
    remoteView: null,
    signalingClient: null,
    peerConnection: null,
    dataChannel: null,
    localStream: null,
    remoteStream: null,
    peerConnectionStatsInterval: null,
  };

  public async startViewer(
    remoteView: HTMLVideoElement,
    channelName: string,
    clientId: string,
    widescreen: boolean,
    onRemoteDataMessage: Function
  ) {
    try {
      this.viewer.remoteView = remoteView;

      // Create KVS client
      const kinesisVideoClient = new AWS.KinesisVideo({
        region: AWS_REGION,
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        correctClockSkew: true,
      });

      // Get signaling channel ARN
      const describeSignalingChannelResponse = await kinesisVideoClient
        .describeSignalingChannel({
          ChannelName: channelName,
        })
        .promise();
      const channelARN =
        describeSignalingChannelResponse.ChannelInfo?.ChannelARN!;
      console.log("[VIEWER] Channel ARN:", channelARN);

      // Get signaling channel endpoints
      const getSignalingChannelEndpointResponse = await kinesisVideoClient
        .getSignalingChannelEndpoint({
          ChannelARN: channelARN,
          SingleMasterChannelEndpointConfiguration: {
            Protocols: ["WSS", "HTTPS"],
            Role: KVSWebRTC.Role.VIEWER,
          },
        })
        .promise();
      const endpointsByProtocol =
        getSignalingChannelEndpointResponse.ResourceEndpointList?.reduce(
          (endpoints, endpoint) => {
            // @ts-ignore
            endpoints[endpoint.Protocol] = endpoint.ResourceEndpoint;
            return endpoints;
          },
          {}
        );
      console.log("[VIEWER] Endpoints:", endpointsByProtocol);

      const kinesisVideoSignalingChannelsClient =
        new AWS.KinesisVideoSignalingChannels({
          region: AWS_REGION,
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
          // @ts-ignore
          endpoint: endpointsByProtocol?.HTTPS,
          correctClockSkew: true,
        });

      // Get ICE server configuration
      const getIceServerConfigResponse =
        await kinesisVideoSignalingChannelsClient
          .getIceServerConfig({
            ChannelARN: channelARN,
          })
          .promise();
      const iceServers = [];
      // Don't add stun if user selects TURN only or NAT traversal disabled
      iceServers.push({
        urls: `stun:stun.kinesisvideo.${AWS_REGION}.amazonaws.com:443`,
      });
      console.log("[VIEWER] ICE servers:", iceServers);

      // Create Signaling Client
      this.viewer.signalingClient = new KVSWebRTC.SignalingClient({
        channelARN,
        // @ts-ignore
        channelEndpoint: endpointsByProtocol?.WSS,
        clientId,
        role: KVSWebRTC.Role.VIEWER,
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID,
          secretAccessKey: AWS_SECRET_ACCESS_KEY,
        },
        systemClockOffset: kinesisVideoClient.config.systemClockOffset,
      });

      const resolution = widescreen
        ? {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          }
        : { width: { ideal: 640 }, height: { ideal: 480 } };
      const constraints = {
        video: resolution,
        audio: true,
      };
      const configuration = {
        iceServers,
        iceTransportPolicy: "all",
      } as RTCConfiguration;
      this.viewer.peerConnection = new RTCPeerConnection(configuration);
      this.viewer.dataChannel =
        this.viewer.peerConnection.createDataChannel("kvsDataChannel");
      this.viewer.peerConnection.ondatachannel = (event) => {
        // @ts-ignore
        event.channel.onmessage = onRemoteDataMessage;
      };

      this.viewer.signalingClient.on("open", async () => {
        console.log("[VIEWER] Connected to signaling service");

        // Create an SDP offer to send to the master
        console.log("[VIEWER] Creating SDP offer");
        await this.viewer.peerConnection?.setLocalDescription(
          await this.viewer.peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          })
        );

        // When trickle ICE is enabled, send the offer now and then send ICE candidates as they are generated. Otherwise wait on the ICE candidates.
        console.log("[VIEWER] Sending SDP offer");
        console.debug(
          "SDP offer:",
          this.viewer.peerConnection?.localDescription
        );
        this.viewer.signalingClient?.sendSdpOffer(
          this.viewer.peerConnection?.localDescription!
        );
        console.log("[VIEWER] Generating ICE candidates");
      });

      this.viewer.signalingClient.on("sdpAnswer", async (answer) => {
        // Add the SDP answer to the peer connection
        console.log("[VIEWER] Received SDP answer");
        console.debug("SDP answer:", answer);
        await this.viewer.peerConnection?.setRemoteDescription(answer);
      });

      this.viewer.signalingClient.on("iceCandidate", (candidate) => {
        // Add the ICE candidate received from the MASTER to the peer connection
        console.log("[VIEWER] Received ICE candidate");
        console.debug("ICE candidate", candidate);
        this.viewer.peerConnection?.addIceCandidate(candidate);
      });

      this.viewer.signalingClient.on("close", () => {
        console.log("[VIEWER] Disconnected from signaling channel");
      });

      this.viewer.signalingClient.on("error", (error) => {
        console.error("[VIEWER] Signaling client error:", error);
      });

      // Send any ICE candidates to the other peer
      this.viewer.peerConnection.addEventListener(
        "icecandidate",
        ({ candidate }) => {
          if (candidate) {
            console.log("[VIEWER] Generated ICE candidate");
            console.debug("ICE candidate:", candidate);

            // When trickle ICE is enabled, send the ICE candidates as they are generated.
            console.log("[VIEWER] Sending ICE candidate");
            this.viewer.signalingClient?.sendIceCandidate(candidate);
          } else {
            console.log("[VIEWER] All ICE candidates have been generated");

            // When trickle ICE is disabled, send the offer now that all the ICE candidates have ben generated.
            console.log("[VIEWER] Sending SDP offer");
            console.debug(
              "SDP offer:",
              this.viewer.peerConnection?.localDescription
            );
            this.viewer.signalingClient?.sendSdpOffer(
              this.viewer.peerConnection?.localDescription!
            );
          }
        }
      );

      this.viewer.peerConnection.addEventListener(
        "connectionstatechange",
        async (event) => {
          printPeerConnectionStateInfo(event, "[VIEWER]", null);
        }
      );

      // As remote tracks are received, add them to the remote view
      this.viewer.peerConnection.addEventListener("track", (event) => {
        console.log("[VIEWER] Received remote track");
        if (remoteView.srcObject) {
          return;
        }
        this.viewer.remoteStream = event.streams[0];
        remoteView.srcObject = this.viewer.remoteStream;
      });
      console.log("[VIEWER] Starting viewer connection");

      this.viewer.signalingClient.open();

      toast.success("Successfully started viewer connection!");

      return true;
    } catch (e) {
      console.error("[VIEWER] Encountered error starting:", e);

      toast.error(
        "Encountered error while starting viewer connection! Please try again."
      );
    }
    return false;
  }

  public stopViewer() {
    try {
      console.log("[VIEWER] Stopping viewer connection");

      if (this.viewer.signalingClient) {
        this.viewer.signalingClient.close();
        this.viewer.signalingClient = null;
      }

      if (this.viewer.peerConnection) {
        this.viewer.peerConnection.close();
        this.viewer.peerConnection = null;
      }

      if (this.viewer.localStream) {
        this.viewer.localStream.getTracks().forEach((track) => track.stop());
        this.viewer.localStream = null;
      }

      if (this.viewer.remoteStream) {
        this.viewer.remoteStream.getTracks().forEach((track) => track.stop());
        this.viewer.remoteStream = null;
      }

      if (this.viewer.peerConnectionStatsInterval) {
        clearInterval(this.viewer.peerConnectionStatsInterval);
        this.viewer.peerConnectionStatsInterval = null;
      }

      if (this.viewer.remoteView) {
        this.viewer.remoteView.srcObject = null;
      }

      if (this.viewer.dataChannel) {
        this.viewer.dataChannel = null;
      }

      toast.success("Successfully stopped viewer connection!");

      return true;
    } catch (e) {
      console.error("[VIEWER] Encountered error stopping", e);

      toast.error(
        "Encountered error while stopping viewer connection! Please try again."
      );
    }
    return false;
  }

  public sendMasterMessage(message: string) {
    if (this.viewer.dataChannel) {
      try {
        this.viewer.dataChannel.send(message);
        console.log("[VIEWER] Sent", message, "to MASTER!");
        return true;
      } catch (e: any) {
        console.error("[VIEWER] Send DataChannel:", e.toString());
        return false;
      }
    } else {
      console.warn("[VIEWER] No DataChannel exists!");
      return false;
    }
  }
}

interface Viewer {
  remoteView: HTMLVideoElement | null;
  signalingClient: KVSWebRTC.SignalingClient | null;
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerConnectionStatsInterval: NodeJS.Timer | null;
}

export default ViewerConnection;
