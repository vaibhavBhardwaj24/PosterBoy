import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import config from "./mikro-orm.config";

let orm: MikroORM<MongoDriver> | null = null;

export async function getORM(): Promise<MikroORM<MongoDriver>> {
  if (orm) {
    return orm;
  }

  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    console.log("🔄 Attempting to connect to MongoDB...");
    console.log("Database name:", process.env.MONGODB_DB_NAME || "rest-client");

    orm = await MikroORM.init<MongoDriver>(config);

    // Test the connection
    await orm.em.getConnection().execute("db.runCommand({ ping: 1 })");

    console.log("✅ Successfully connected to MongoDB");
    return orm;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    console.error("Connection details:", {
      hasUri: !!process.env.MONGODB_URI,
      dbName: process.env.MONGODB_DB_NAME || "rest-client",
      nodeEnv: process.env.NODE_ENV,
    });
    throw error;
  }
}

export async function closeORM(): Promise<void> {
  if (orm) {
    await orm.close();
    orm = null;
  }
}
