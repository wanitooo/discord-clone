import { io, Socket } from "socket.io-client";
import { ServerToClientEvents, ClientToServerEvents } from "./typings";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000"
);

export default socket;
