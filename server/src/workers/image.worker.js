import { Worker } from "bullmq";
import connection from "../config/redis.js";
import processUploadedImage from "../services/imageProcessingServices.js";

const worker = new Worker(
  "image-processing",
  async (job) => {
    return processUploadedImage(job);
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
  console.log(job.returnvalue);
});
worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed with error ${err.message}`);
});

export default worker;