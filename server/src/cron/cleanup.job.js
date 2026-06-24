import cron from "node-cron";
import { cleanUpProcessedImages } from "./cleanup.service.js";

export default function startCleanupJob() {
  cron.schedule("*/5 * * * * *", async () => {
    console.log("Running cleanup job...");

    await cleanUpProcessedImages();
  });
}