require("dotenv").config();
import { Redis } from "ioredis";

const redisClient = () => {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    throw new Error("REDIS_URL environment variable is not set.");
  }
  return redisUrl;
};

export const redis = new Redis(redisClient(),{ connectTimeout: 15000 });

redis.on("connect", () => {
  console.log("Redis connection established");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redis.on("reconnecting", (time: any) => {
  console.log(`Redis reconnecting in ${time} ms`);
});

redis.on("end", () => {
  console.log("Redis connection closed");
});
