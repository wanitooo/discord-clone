import { PeerStream } from "./hooks/global-store";

export interface ServerToClientEvents {
  noArg: () => void;
  //   basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  joinChannel: (data: {
    userId: number;
    channelId?: number;
    channelUUID: string;
    debug?: string;
    peerId?: string;
    activeUsers: PeerStream[];
  }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

// const io = new Server<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >();
