import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { getORM } from "@/db/init";
import { RequestHistory } from "@/entities/RequestHistory";
import { RequestData } from "@/types";
import { ObjectId } from "@mikro-orm/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body: RequestData = await request.json();
    const { method, url, headers, body: requestBody } = body;

    if (!method || !url) {
      return NextResponse.json(
        { error: "Method and URL are required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    try {
      const response = await axios({
        method: method.toLowerCase(),
        url,
        headers: headers || {},
        data: requestBody ? JSON.parse(requestBody) : undefined,
        validateStatus: () => true,
      });

      const responseTime = Date.now() - startTime;

      const responseData = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        data: response.data,
        responseTime,
      };

      try {
        const orm = await getORM();
        const em = orm.em.fork();

        const historyEntry = em.create(RequestHistory, {
          _id: new ObjectId(),
          method,
          url,
          headers,
          body: requestBody,
          response: responseData,
          timestamp: new Date(),
        });

        await em.persistAndFlush(historyEntry);
      } catch (dbError) {
        console.error("Failed to save to history:", dbError);
      }

      return NextResponse.json(responseData);
    } catch (error) {
      const axiosError = error as AxiosError;
      const responseTime = Date.now() - startTime;

      const errorResponse = {
        status: axiosError.response?.status || 0,
        statusText: axiosError.message || "Request failed",
        headers: (axiosError.response?.headers as Record<string, string>) || {},
        data: axiosError.response?.data || { error: axiosError.message },
        responseTime,
      };

      try {
        const orm = await getORM();
        const em = orm.em.fork();

        const historyEntry = em.create(RequestHistory, {
          _id: new ObjectId(),
          method,
          url,
          headers,
          body: requestBody,
          response: errorResponse,
          timestamp: new Date(),
        });

        await em.persistAndFlush(historyEntry);
      } catch (dbError) {
        console.error("Failed to save to history:", dbError);
      }

      return NextResponse.json(errorResponse, { status: 200 });
    }
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Invalid request format" },
      { status: 400 }
    );
  }
}
