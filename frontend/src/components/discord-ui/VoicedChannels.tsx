import { useEffect, useRef, useState } from "react";
import { Separator } from "../shadcn/ui";
import { Peer } from "peerjs";
import { PeerStream, usePeers } from "../../hooks/global-store";
import socket from "../../socket";
import { useParams } from "@tanstack/react-router";
import VideoPlayer from "./VideoPlayer";

// TODO: Render video streams - 20 min in C&B
const VoicedChannels = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [remotePeer, setRemotePeer] = useState("");
  const [peerInstance, setPeerInstance] = useState<Peer>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [remoteVideoRefs, setRemoteVideoRefs] = useState(null);

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

  return (
    <div>
      <Separator className="bg-white h-2" />
      Welcome to # INSERT VOICE CHANNEL HERE {peerInstance?.id}
      <div className="w-full h-[900px]">
        <Separator className="bg-white h-2" />
        <h1>Local Stream</h1>

        <VideoPlayer
          mediaStream={mediaStream}
          key={Math.random()}
          className="w-1/4"
        />
        <h1>Remote Stream</h1>

        <div className="w-full h-full grid grid-cols-4 gap-9">
          {Object.values(peerStreams as PeerStream[]).map((peerStream) => (
            <VideoPlayer mediaStream={peerStream.stream} key={Math.random()} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoicedChannels;
