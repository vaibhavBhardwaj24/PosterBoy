"use client";

import { useState } from "react";
import RequestBuilder from "@/components/RequestBuilder";
import ResponseDisplay from "@/components/ResponseDisplay";
import RequestHistory from "@/components/RequestHistory";
import { RequestData, ResponseData, HistoryItem } from "@/types";

export default function Home() {
  const [response, setResponse] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSendRequest = async (request: RequestData) => {
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data: ResponseData = await res.json();
      setResponse(data);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Request failed:", error);
      setResponse({
        status: 0,
        statusText: "Network Error",
        headers: {},
        data: { error: "Failed to send request" },
        responseTime: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadRequest = (item: HistoryItem) => {
    if (typeof window !== "undefined" && (window as any).loadRequest) {
      (window as any).loadRequest({
        method: item.method,
        url: item.url,
        headers: item.headers,
        body: item.body,
      });
    }
    if (item.response) {
      setResponse(item.response);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">REST Client</h1>
          <p className="text-gray-600">
            A Postman-like HTTP client for testing APIs
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <RequestBuilder onSend={handleSendRequest} loading={loading} />
          </div>
          <div>
            <ResponseDisplay response={response} />
          </div>
        </div>

        <div>
          <RequestHistory
            onLoadRequest={handleLoadRequest}
            refreshTrigger={refreshTrigger}
          />
        </div>
      </div>
    </div>
  );
}
