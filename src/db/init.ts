import { MikroORM } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import config from "./mikro-orm.config";

let orm: MikroORM<MongoDriver> | null = null;

export async function getORM(): Promise<MikroORM<MongoDriver>> {
  if (orm) {
    return orm;
  }

  try {
    orm = await MikroORM.init<MongoDriver>(config);
    console.log("✅ Connected to MongoDB");
    return orm;
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function closeORM(): Promise<void> {
  if (orm) {
    await orm.close();
    orm = null;
  }
}
