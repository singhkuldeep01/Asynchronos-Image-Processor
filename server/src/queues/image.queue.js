import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});
// want to TTl on complete to clear

export const imageQueue = new Queue("image-processing", {
  connection,
});