import { QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { getIO } from "../socket/socket.js";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

export function initQueueEvents() {
  const io = getIO();

  const queueEvents = new QueueEvents("image-processing", {
    connection,
  });

  queueEvents.on("progress", ({ jobId, data }) => {
  io.to(`job:${jobId}`).emit("job-progress", {
    jobId,
    progress: data,
  });
});

  queueEvents.on("completed", ({ jobId, returnvalue }) => {
    io.to(`job:${jobId}`).emit("job-completed", {
      jobId,
      returnvalue,
    });
  });

  queueEvents.on("failed", ({ jobId, failedReason }) => {
    io.to(`job:${jobId}`).emit("job-failed", {
      jobId,
      failedReason,
    });
  });

  return queueEvents;
}