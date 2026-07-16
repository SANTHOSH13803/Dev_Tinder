import { BASE_URL } from "@/constants/urls";
import { io } from "socket.io-client";

export default function createSocketInstance() {
  const socket = io(BASE_URL);
  return socket;
}
