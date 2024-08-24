import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../shadcn/ui";
import { Peer } from "peerjs";
import { PeerStream, useChannels, usePeers } from "../../hooks/global-store";
import socket from "../../socket";
import { useParams } from "@tanstack/react-router";
import VideoPlayer from "./VideoPlayer";
import { cn } from "../shadcn/utils/utils";

// TODO: Fix new client created each time a channel is clicked, this causes a memory leak
const VoicedChannel = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [peerInstance, setPeerInstance] = useState<Peer>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { activeChannel } = useChannels();

  const { peerStreams, addPeerStream, removePeerStream } = usePeers();
  const { channelUUID, serverUUID } = useParams({ from: "/app" });
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
      .getUserMedia({ video: true, audio: true })
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
      channelUUID,
      serverUUID,
      peerId: peerInstance.id,
    });

    peerInstance.on("call", (c) => {
      c.answer(mediaStream);
      c.on("stream", (callerStream) => {
        addPeerStream(c.peer, callerStream);
      });
    });

    socket.on("userJoined", ({ peerId }: { peerId: string }) => {
      console.log("triggered");
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
      // console.log("toDelete", toDelete);
      removePeerStream(toDelete);
    });

    // return () => {
    //   peerInstance.destroy();
    //   removePeerStream(peerInstance.id);
    // };
  }, [
    peerInstance,
    mediaStream,
    addPeerStream,
    channelUUID,
    removePeerStream,
    serverUUID,
  ]);

  useEffect(() => {
    console.log("peerstreams", peerStreams);
  }, [peerStreams]);

  const videoPlayerClasses = cn(
    "rounded-lg grow-1 shrink-1 max-w-[45%] max-h-[45%] cursor-pointer",
    peerStreams.length >= 2 ? "basis-1/3" : "basis-1/2"
  );

  return (
    <ScrollArea className="bg-black w-full h-full flex flex-row group">
      {/* On hover hud */}
      <div className="absolute top-4 left-0 right-0 w-full h-full text-white  transition-all ease-in-out duration-500 ">
        <div className="-translate-y-2 group-hover:translate-y-2 opacity-0 group-hover:opacity-100 text-2xl font-ggSans font-normal scale-y-[85%] group-hover:scale-y-100 px-6 duration-300 transition-all">
          # {activeChannel.channelName} | peer: {peerInstance?.id}
        </div>

        <div className="absolute bottom-4 left-0 right-0 w-full bg-white text-black opacity-0 group-hover:opacity-100 duration-300 transition-all">
          Voice call controls
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap w-full h-full items-center align-middle justify-center gap-2 pt-16"
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
    </ScrollArea>
  );
};

export default VoicedChannel;
