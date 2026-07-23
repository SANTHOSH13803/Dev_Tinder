import { BASE_URL } from "@/constants/urls";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export default function createSocketInstance() {
  if (!socket) {
    if (location.hostname === "localhost") {
      socket = io(BASE_URL);
    } else {
      socket = io("/", {
        path: BASE_URL + "/socket.io"
      });
    }
  }

  return socket;
}
