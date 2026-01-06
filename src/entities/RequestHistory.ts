import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
  Index,
} from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  responseTime: number;
}

@Entity()
@Index({ properties: ["timestamp"] }) // Index for sorting by date
@Index({ properties: ["method"] }) // Index for filtering by method
@Index({ properties: ["url"] }) // Index for search by URL
export class RequestHistory {
  @PrimaryKey()
  _id!: ObjectId;

  @SerializedPrimaryKey()
  id!: string;

  @Property()
  method!: string;

  @Property()
  url!: string;

  @Property({ type: "json", nullable: true })
  headers?: Record<string, string>;

  @Property({ nullable: true })
  body?: string;

  @Property({ type: "json", nullable: true })
  response?: ResponseData;

  @Property()
  timestamp: Date = new Date();
}
