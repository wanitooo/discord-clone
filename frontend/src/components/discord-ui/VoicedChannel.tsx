import { useEffect, useRef, useState } from "react";
import { Separator } from "../shadcn/ui";
import { Peer } from "peerjs";
import { PeerStream, useChannels, usePeers } from "../../hooks/global-store";
import socket from "../../socket";
import { useParams } from "@tanstack/react-router";
import VideoPlayer from "./VideoPlayer";
import { cn } from "../shadcn/utils/utils";

const VoicedChannel = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [remotePeer, setRemotePeer] = useState("");
  const [peerInstance, setPeerInstance] = useState<Peer>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [remoteVideoRefs, setRemoteVideoRefs] = useState(null);
  const { activeChannel } = useChannels();

  const {
    peerStreams,
    addPeerStream,
    removePeerStream,
    clearPeerStreams,
    setPeerStream,
  } = usePeers();
  const { channelId } = useParams();
  // Create Peer id upon joing the channel
  useEffect(() => {
    if (peerInstance) return;
    const a_random_id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(2, 10);

    const peer = new Peer(a_random_id); // TODO: change to userID at one point
    setPeerInstance(peer);
    console.log("peerid:", peer.id);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });

    return () => {
      peer.destroy();
      removePeerStream(peer.id);
    };
  }, []);

  useEffect(() => {
    if (!peerInstance) return;
    if (!mediaStream) return;

    socket.emit("joinChannel", {
      userId: 22,
      channelId,
      peerId: peerInstance.id,
    });

    peerInstance.on("call", (c) => {
      // console.log("got called", c.peer);
      c.answer(mediaStream);
      c.on("stream", (callerStream) => {
        addPeerStream(c.peer, callerStream);
      });
    });

    // socket.emit("ready");
    socket.on("userJoined", ({ peerId }: { peerId: string }) => {
      if (peerId !== peerInstance.id) {
        console.log("user joined", peerId);
        setTimeout(() => {
          const call = peerInstance.call(peerId, mediaStream);

          // console.log("call triggered", call);
          call.on("stream", (peerStream) => {
            addPeerStream(peerId, peerStream);
            // console.log("peerStream after calling ", peerStreams);
          });
        }, 1000);
      }
    });

    socket.on("userDisconnected", ({ toDelete }) => {
      console.log("toDelete", toDelete);
      removePeerStream(toDelete);

      // console.log("peerStreams after disconnection", peerStreams);
      // setPeerStream(activeUsers);
    });
  }, [peerInstance, mediaStream, addPeerStream, channelId, removePeerStream]);

  useEffect(() => {
    console.log("peerstreams", peerStreams);
  }, [peerStreams]);

  const videoPlayerClasses = cn(
    peerStreams?.length >= 1 ? "w-full gap-4 h-auto" : "w-1/2"
  );

  return (
    <div className="bg-black w-full h-full overflow-clip">
      <Separator className="bg-white h-2" />
      Welcome to # {activeChannel.channelName}, peer: {peerInstance?.id}
      <div
        className={cn(
          "grid mx-16 w-full pt-36",
          peerStreams?.length >= 1
            ? "grid-cols-2 justify-items-center"
            : "grid-cols-1 justify-items-center"
        )}
      >
        <VideoPlayer
          mediaStream={mediaStream}
          key={Math.random()}
          className={videoPlayerClasses}
        />

        {Object.values(peerStreams as PeerStream[]).map((peerStream) => (
          <VideoPlayer
            mediaStream={peerStream.stream}
            key={Math.random()}
            className={videoPlayerClasses}
          />
        ))}
      </div>
    </div>
  );
};

export default VoicedChannel;
