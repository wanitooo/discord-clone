import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./typings";
import Peer from "peerjs";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);

function createPeer(): Peer {
  const randomId = Math.random().toString(36).substring(2, 12); // Generate a random string of 10 characters
  const peer = new Peer(randomId); // TODO: Replace with userID when available
  console.log("PEER CREATED", peer.id);
  return peer;
}

const peer = createPeer();

export { socket, peer };

export default socket;
