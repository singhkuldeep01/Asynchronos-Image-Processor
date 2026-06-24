import http from "http";
import { Server } from "socket.io";
import apiRoutes from "../src/apis/index.js";
import app from "./app.js";
import {initSocket} from "./socket/socket.js";
import { initQueueEvents } from "./queues/queueEvents.js";
import startCleanupJob  from "./cron/cleanup.job.js";

const server = http.createServer(app);

 initSocket(server);
 initQueueEvents();
//  startCleanupJob();


server.listen(3000, () => {
  console.log("Server running on port 3000");
});