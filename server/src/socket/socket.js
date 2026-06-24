import { Server } from "socket.io";

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("join-job-room", ({ jobId }) => {
      socket.join(`job:${jobId}`);

      console.log(`${socket.id} joined room job:${jobId}`);

      // Optional confirmation
      socket.emit("joined-room", {
        room: `job:${jobId}`,
      });
    });
  });

  return io;
}

export function getIO() {
  return io;
}
