import { REDIS_URL } from "@/v1/utils/env";
import { createClient } from "redis";

const redis = createClient({
  url: REDIS_URL,
});

redis.on("error", (err) => {
  console.log(err);
});
redis.on("connect", () => {
  // TODO: Log Connection Status
  console.log("Redis Connected");
});
redis.connect();
export default redis;
