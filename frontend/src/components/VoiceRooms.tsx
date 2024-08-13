import { useEffect, useRef, useState } from "react";
import { Separator } from "./shadcn/ui";
import { Peer } from "peerjs";

const VoiceRooms = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream>();
  const [remotePeer, setRemotePeer] = useState("");
  const [currPeerId, setCurrPeerId] = useState("");
  const [peerInstance, setPeerInstance] = useState<Peer>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const a_random_id = Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(2, 10);
    const peer = new Peer(a_random_id);
    setPeerInstance(peer);
    setCurrPeerId(peer.id);
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

    peer.on("call", (call) => {
      call.answer(mediaStream);
      call.on("stream", (remoteStream) => {
        if (videoRef2.current) {
          videoRef2.current.srcObject = remoteStream;
        }
      });
    });

    // peer.on("connection", (conn) => {
    //   conn.on("data", (data) => {
    //     console.log(data);
    //   });
    //   conn.on("open", () => {
    //     conn.send("hello!");
    //   });
    // });

    return () => {
      peer.destroy();
    };
  }, []);

  const call = () => {
    console.log("remote peer set as: ", remotePeer);
    if (!peerInstance) return;
    if (!mediaStream) return;
    // const local_conn = peerInstance.connect(remotePeer);

    // local_conn.on("open", () => {
    //   local_conn.send("SUIOADJHASJDHASH!");
    // });

    // local_conn.on("error", (err) => {
    //   console.error("Connection error:", err);
    // });
    const peerCall = peerInstance.call(remotePeer, mediaStream);
  };

  return (
    <div>
      <Separator className="bg-white h-2" />
      Welcome to # INSERT VOICE CHANNEL HERE {currPeerId}
      <div className="w-full h-[900px]">
        <Separator className="bg-white h-2" />
        <h1>Local Stream</h1>
        <video ref={videoRef} className="h-1/4 w-1/4" autoPlay playsInline />

        <h1>Remote Stream</h1>
        <video ref={videoRef2} className="h-1/4 w-1/4 " autoPlay playsInline />

        <input
          type="text"
          className="text-black"
          placeholder="set remote peer id"
          value={remotePeer}
          onChange={(e) => setRemotePeer(e.target.value)}
        />

        <button onClick={call}>Submit</button>
      </div>
    </div>
  );
};

export default VoiceRooms;
