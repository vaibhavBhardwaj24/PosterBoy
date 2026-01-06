"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { HistoryItem, PaginatedResponse } from "@/types";
import { formatDate, getMethodColor, getStatusColor } from "@/utils/formatters";

interface RequestHistoryProps {
  onLoadRequest: (item: HistoryItem) => void;
  refreshTrigger: number;
}

export default function RequestHistory({
  onLoadRequest,
  refreshTrigger,
}: RequestHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMethod, setFilterMethod] = useState<string>("");

  // Cache for storing fetched pages
  const cacheRef = useRef<Map<string, HistoryItem[]>>(new Map());

  // Infinite scroll observer
  const observerTarget = useRef<HTMLDivElement>(null);

  const getCacheKey = (pageNum: number, search: string, method: string) => {
    return `${pageNum}-${search}-${method}`;
  };

  const fetchHistory = useCallback(
    async (pageNum: number, append = false) => {
      const cacheKey = getCacheKey(pageNum, searchTerm, filterMethod);

      // Check cache first
      if (cacheRef.current.has(cacheKey) && !append) {
        const cachedData = cacheRef.current.get(cacheKey)!;
        setHistory(cachedData);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "20",
        });

        if (searchTerm) params.append("search", searchTerm);
        if (filterMethod) params.append("method", filterMethod);

        const response = await fetch(`/api/history?${params}`);
        const data: PaginatedResponse<HistoryItem> & { hasMore?: boolean } =
          await response.json();

        // Update cache
        cacheRef.current.set(cacheKey, data.data);

        if (append) {
          setHistory((prev) => [...prev, ...data.data]);
        } else {
          setHistory(data.data);
        }

        setTotalPages(data.totalPages);
        setPage(pageNum);
        setHasMore(data.hasMore ?? pageNum < data.totalPages);
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, filterMethod]
  );

  // Initial load and refresh trigger
  useEffect(() => {
    cacheRef.current.clear(); // Clear cache on refresh
    setPage(1);
    setHistory([]);
    fetchHistory(1);
  }, [refreshTrigger, searchTerm, filterMethod, fetchHistory]);

  // Infinite scroll implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchHistory(page + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, page, fetchHistory]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this history item?")) {
      return;
    }

    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      cacheRef.current.clear(); // Clear cache after delete
      setHistory([]);
      setPage(1);
      fetchHistory(1);
    } catch (error) {
      console.error("Failed to delete history item:", error);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all history?")) {
      return;
    }

    try {
      await fetch("/api/history", { method: "DELETE" });
      cacheRef.current.clear(); // Clear cache
      setHistory([]);
      setPage(1);
      setHasMore(false);
    } catch (error) {
      console.error("Failed to clear history:", error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    cacheRef.current.clear();
  };

  const handleFilterMethod = (value: string) => {
    setFilterMethod(value);
    cacheRef.current.clear();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Request History</h2>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search by URL..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="text-black flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterMethod}
          onChange={(e) => handleFilterMethod(e.target.value)}
          className="px-4 text-black py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Methods</option>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {loading && history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <p className="text-lg font-medium">No history yet</p>
          <p className="text-sm mt-2">Your request history will appear here</p>
        </div>
      ) : (
        <>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer group"
                onClick={() => onLoadRequest(item)}
              >
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-semibold ${getMethodColor(
                    item.method
                  )}`}
                >
                  {item.method}
                </span>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {item.url}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.timestamp)}
                  </p>
                </div>

                {item.response && (
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${getStatusColor(
                      item.response.status
                    )}`}
                  >
                    {item.response.status}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerTarget} className="py-4 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 mt-2">Loading more...</p>
              </div>
            )}
          </div>

          {/* Traditional pagination fallback */}
          {!hasMore && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 border-t-2 border-gray-200">
              <span className="text-sm text-gray-600">
                Showing {history.length} of {history.length} items
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
