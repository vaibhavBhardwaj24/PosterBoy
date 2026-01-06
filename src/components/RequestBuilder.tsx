"use client";

import { useState } from "react";
import { HttpMethod, RequestData } from "@/types";
import HeaderEditor from "./HeaderEditor";
import { getMethodColor } from "@/utils/formatters";

interface RequestBuilderProps {
  onSend: (request: RequestData) => Promise<void>;
  loading: boolean;
}

export default function RequestBuilder({
  onSend,
  loading,
}: RequestBuilderProps) {
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState("");

  const handleSend = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    await onSend({
      method,
      url,
      headers,
      body: body.trim() || undefined,
    });
  };

  const handleClear = () => {
    setUrl("");
    setHeaders({});
    setBody("");
  };

  const loadRequest = (request: RequestData) => {
    setMethod(request.method);
    setUrl(request.url);
    setHeaders(request.headers || {});
    setBody(request.body || "");
  };

  if (typeof window !== "undefined") {
    (window as any).loadRequest = loadRequest;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Request Builder</h2>

      <div className="flex gap-3">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value as HttpMethod)}
          className={`px-4 py-2 border-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${getMethodColor(
            method
          )}`}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <HeaderEditor headers={headers} onChange={setHeaders} />

      {(method === "POST" || method === "PUT") && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Request Body (JSON)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{\n  "key": "value"\n}'
            className="w-full h-48 px-4 py-3 border-2 border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
