import { defineConfig } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { RequestHistory } from "../entities/RequestHistory";

export default defineConfig({
  entities: [RequestHistory],
  dbName: process.env.MONGODB_DB_NAME || "rest-client",
  clientUrl: process.env.MONGODB_URI,
  driver: MongoDriver,
  debug: process.env.NODE_ENV !== "production",
});
