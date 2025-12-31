import IORedis from "ioredis";
import { Queue } from "bullmq";

const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
});

export const tagQueue = new Queue("tag-generation", {
  connection,
});

export const bugReportQueue = new Queue("bug-report-processing", {
  connection,
});
