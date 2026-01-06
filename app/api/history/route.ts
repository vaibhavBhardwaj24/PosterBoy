import { NextRequest, NextResponse } from "next/server";
import { getORM } from "@/db/init";
import { RequestHistory } from "@/entities/RequestHistory";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const method = searchParams.get("method");
    const search = searchParams.get("search");

    console.log("📥 Fetching history:", { page, limit, method, search });

    const orm = await getORM();
    const em = orm.em.fork();

    const filters: any = {};

    if (method) {
      filters.method = method.toUpperCase();
    }

    if (search) {
      filters.url = { $regex: search, $options: "i" };
    }

    const total = await em.count(RequestHistory, filters);
    console.log("📊 Total records found:", total);

    const history = await em.find(RequestHistory, filters, {
      orderBy: { timestamp: "DESC" },
      limit,
      offset: skip,
    });

    console.log("✅ Successfully fetched", history.length, "records");

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: history,
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("❌ Failed to fetch history:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: "Failed to fetch history",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const orm = await getORM();
    const em = orm.em.fork();

    await em.nativeDelete(RequestHistory, {});

    return NextResponse.json({ message: "All history deleted" });
  } catch (error) {
    console.error("Failed to delete history:", error);
    return NextResponse.json(
      { error: "Failed to delete history" },
      { status: 500 }
    );
  }
}
