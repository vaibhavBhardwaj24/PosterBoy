import { NextRequest, NextResponse } from "next/server";
import { getORM } from "@/db/init";
import { RequestHistory } from "@/entities/RequestHistory";
import { ObjectId } from "@mikro-orm/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orm = await getORM();
    const em = orm.em.fork();

    const historyItem = await em.findOne(RequestHistory, {
      _id: new ObjectId(id),
    });

    if (!historyItem) {
      return NextResponse.json(
        { error: "History item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(historyItem);
  } catch (error) {
    console.error("Failed to fetch history item:", error);
    return NextResponse.json(
      { error: "Failed to fetch history item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orm = await getORM();
    const em = orm.em.fork();

    const historyItem = await em.findOne(RequestHistory, {
      _id: new ObjectId(id),
    });

    if (!historyItem) {
      return NextResponse.json(
        { error: "History item not found" },
        { status: 404 }
      );
    }

    await em.removeAndFlush(historyItem);

    return NextResponse.json({ message: "History item deleted" });
  } catch (error) {
    console.error("Failed to delete history item:", error);
    return NextResponse.json(
      { error: "Failed to delete history item" },
      { status: 500 }
    );
  }
}
