import { useEffect, useRef, useState } from "react";
import { Button, ScrollArea } from "../shadcn/ui";
import { Peer } from "peerjs";
import { PeerStream, useChannels, usePeers } from "../../hooks/global-store";
import socket from "../../socket";
import { useParams } from "@tanstack/react-router";
import VideoPlayer from "./VideoPlayer";
import { cn } from "../shadcn/utils/utils";
import {
  SpeakerWaveIcon,
  HashtagIcon,
  MicrophoneIcon,
  PhoneXMarkIcon,
  ComputerDesktopIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/solid";

// TODO: Fix client disconnect created on text channels
const VoicedChannel = ({ channel }) => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  // const [peerInstance, setPeerInstance] = useState<Peer>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [joined, setJoined] = useState(false);
  const { activeChannel } = useChannels();

  const {
    peerInstance,
    peerStreams,
    addPeerStream,
    removePeerStream,
    clearPeerStreams,
  } = usePeers();
  const { channelUUID, serverUUID } = useParams({
    from: "/app",
  });
  // Create Peer id upon joing the channel
  useEffect(() => {
    // if (!peer) return;
    // setPeerInstance(peer);
    // console.log("peerid:", peerInstance.id);

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

    // socket.on("channelMessages", (data) => console.log("message ", data));
    return () => {
      // peer.destroy();
      removePeerStream(peerInstance.id);
    };
  }, []);

  const joinChannel = () => {
    // console.log("join channel triggered");
    // console.log("peer instance", peerInstance.id);
    if (!peerInstance) return;
    if (joined == true) {
      // leave from the past channel
      leaveChannel();
    }
    socket.connect();
    socket.emit("joinChannel", {
      userId: 22,
      channelUUID,
      serverUUID,
      peerId: peerInstance.id,
    });
    setJoined(true);

    peerInstance.on("call", (c) => {
      c.answer(mediaStream);
      c.on("stream", (callerStream) => {
        addPeerStream(c.peer, callerStream);
      });
    });

    socket.on("userJoined", ({ peerId }: { peerId: string }) => {
      // console.log("triggered");
      if (peerId !== peerInstance.id) {
        // console.log("user joined", peerId);
        setTimeout(() => {
          const call = peerInstance.call(peerId, mediaStream);
          if (call) {
            // console.log("call triggered", call);
            call.on("stream", (peerStream) => {
              addPeerStream(peerId, peerStream);
              // console.log("peerStream after calling ", peerStreams);
            });
          }
        }, 1000);
      }
    });
  };

  const leaveChannel = () => {
    socket.emit("leaveChannel", {
      channelUUID,
    });
    setJoined(false);
    clearPeerStreams();
    socket.disconnect();
  };

  useEffect(() => {
    if (!peerInstance) return;
    if (!mediaStream) return;

    joinChannel();

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

  // useEffect(() => {
  //   console.log("peerstreams", peerStreams);
  // }, [peerStreams]);

  const videoPlayerClasses = cn(
    "rounded-lg grow-1 shrink-1 max-w-[45%] max-h-[45%] cursor-pointer",
    peerStreams.length >= 2 ? "basis-1/3" : "basis-1/2"
  );

  return (
    <ScrollArea className="bg-black w-full h-screen flex flex-row group">
      {/* On hover hud */}
      <div className="absolute top-4 left-0 right-0 w-full h-full text-white  transition-all ease-in-out duration-500 ">
        <div className="-translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 font-ggSans font-normal text-base scale-y-[85%] group-hover:scale-y-100 px-6 duration-300 transition-all">
          <div className="flex flex-row gap-2">
            <SpeakerWaveIcon width={20} className="mr-2" />
            <span className="lowercase">{channel.channelName}</span>
            <span className="text-green-400">{peerInstance?.id}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 w-full  opacity-0 group-hover:opacity-100 duration-300 transition-all">
          <div className="flex flex-row w-full h-fit justify-center pb-6 gap-4">
            <VideoCameraIcon
              width={55}
              className="mx-2 bg-discord-gray p-4 rounded-full cursor-pointer hover:bg-discord-blackest"
            />
            <ComputerDesktopIcon
              width={55}
              className="mx-2 bg-discord-gray p-4 rounded-full cursor-pointer hover:bg-discord-blackest"
            />
            <MicrophoneIcon
              width={55}
              className="mx-2 bg-discord-gray p-4 rounded-full cursor-pointer hover:bg-discord-blackest"
            />
            <PhoneXMarkIcon
              width={55}
              className="mx-2 bg-red-500 p-4 rounded-full cursor-pointer hover:opacity-75"
              onClick={leaveChannel}
            />
          </div>
        </div>
      </div>
      {joined ? (
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
      ) : (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
          <span className="text-3xl font-bold">{channel.channelName}</span>
          <span className="text-sm font-normal text-gray-300">
            You've left the channel
          </span>
          <Button
            className="rounded-3xl z-30"
            variant={"green"}
            onClick={joinChannel}
          >
            Join Voice
          </Button>
        </div>
      )}
    </ScrollArea>
  );
};

export default VoicedChannel;
