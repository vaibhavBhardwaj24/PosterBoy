"use client";

import { useState } from "react";
import { ResponseData } from "@/types";
import {
  formatJSON,
  getStatusColor,
  formatResponseTime,
} from "@/utils/formatters";

interface ResponseDisplayProps {
  response: ResponseData | null;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  const [activeTab, setActiveTab] = useState<"body" | "headers" | "raw">(
    "body"
  );

  if (!response) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg
            className="w-24 h-24 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-lg font-medium">No response yet</p>
          <p className="text-sm mt-2">
            Send a request to see the response here
          </p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Response</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {formatResponseTime(response.responseTime)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
              response.status
            )}`}
          >
            {response.status} {response.statusText}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab("body")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "body"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Body
        </button>
        <button
          onClick={() => setActiveTab("headers")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "headers"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Headers
        </button>
        <button
          onClick={() => setActiveTab("raw")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "raw"
              ? "text-blue-600 border-b-2 border-blue-600 -mb-0.5"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Raw
        </button>
      </div>

      <div className="relative">
        <button
          onClick={() => {
            const content =
              activeTab === "body"
                ? formatJSON(response.data)
                : activeTab === "headers"
                ? formatJSON(response.headers)
                : formatJSON(response);
            copyToClipboard(content);
          }}
          className="absolute top-2 right-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg transition-colors z-10"
        >
          Copy
        </button>

        <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-auto">
          {activeTab === "body" && (
            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {formatJSON(response.data)}
            </pre>
          )}

          {activeTab === "headers" && (
            <div className="space-y-2">
              {Object.entries(response.headers).map(
                ([key, value]: [string, any]) => (
                  <div key={key} className="flex gap-2">
                    <span className="font-semibold text-gray-700 min-w-[200px]">
                      {key}:
                    </span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "raw" && (
            <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap">
              {formatJSON(response)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
