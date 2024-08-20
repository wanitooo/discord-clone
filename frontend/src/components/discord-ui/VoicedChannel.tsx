import { useEffect, useRef, useState } from "react";
import { ScrollArea, Separator } from "../shadcn/ui";
import { Peer } from "peerjs";
import { PeerStream, useChannels, usePeers } from "../../hooks/global-store";
import socket from "../../socket";
import { useParams } from "@tanstack/react-router";
import VideoPlayer from "./VideoPlayer";
import { cn } from "../shadcn/utils/utils";

// TODO: Fix not able to scroll with group hover
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
      // implementation lags like hell if you force a 16:9 aspect ratio
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
    "grow-1 shrink-1 basis-1/2 max-w-[45%] max-h-[45%]"
  );

  return (
    <ScrollArea className="bg-black w-full h-full flex flex-row p-16 ">
      {/* On hover hud */}
      <div className="absolute top-4 left-0 right-0 w-full h-full z-20 text-white opacity-0 hover:opacity-100 transition-all group ease-in-out duration-500">
        <div className="-translate-y-2 group-hover:translate-y-2 transition-all text-2xl font-ggSans font-normal scale-y-[85%] group-hover:scale-y-100 px-6 duration-300">
          # {activeChannel.channelName} | peer: {peerInstance?.id}
        </div>
        <div className="absolute bottom-4 left-0 right-0 w-full z-30 bg-white text-black group-hover:">
          Voice call controls
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap w-full h-full items-center align-middle justify-center gap-2"
        )}
      >
        {/* 
        <Separator className="bg-white h-2" /> */}
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
    </ScrollArea>
  );
};

export default VoicedChannel;
