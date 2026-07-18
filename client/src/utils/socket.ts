import { BASE_URL } from "@/constants/urls";
import { io } from "socket.io-client";

export default function createSocketInstance() {
  if (location.hostname === "localhost") {
    return io(BASE_URL);
  }
  return io("/", { path: BASE_URL + "/socket.io" });
}
