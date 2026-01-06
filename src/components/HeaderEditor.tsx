"use client";

import { useState } from "react";
import { HttpMethod } from "@/types";

interface HeaderEditorProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

export default function HeaderEditor({ headers, onChange }: HeaderEditorProps) {
  const headerEntries = Object.entries(headers);

  const addHeader = () => {
    onChange({ ...headers, "": "" });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...headers };
    if (oldKey !== newKey && oldKey in newHeaders) {
      delete newHeaders[oldKey];
    }
    if (newKey) {
      newHeaders[newKey] = value;
    }
    onChange(newHeaders);
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    onChange(newHeaders);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">Headers</label>
        <button
          onClick={addHeader}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Header
        </button>
      </div>

      <div className="space-y-2">
        {headerEntries.map(([key, value], index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              placeholder="Header name"
              value={key}
              onChange={(e) => updateHeader(key, e.target.value, value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Header value"
              value={value}
              onChange={(e) => updateHeader(key, key, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => removeHeader(key)}
              className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              ✕
            </button>
          </div>
        ))}

        {headerEntries.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No headers added. Click &quot;Add Header&quot; to add one.
          </p>
        )}
      </div>
    </div>
  );
}
