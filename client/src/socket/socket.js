import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: true,
});

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});

socket.on("job-completed", ({ jobId, returnvalue }) => {
  console.log(`Job ${jobId} completed with return value:`, returnvalue);
});
socket.on("job-progress", ({ jobId, progress }) => {
  console.log(`Job ${jobId} progress: ${progress}%`);
});
socket.on("job-failed", ({ jobId, failedReason }) => {
  console.log(`Job ${jobId} failed with reason:`, failedReason);
});

export function getSocket() {
  return socket;
}

export default socket;