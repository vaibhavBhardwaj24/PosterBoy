export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestData {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export interface ResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  responseTime: number;
}

export interface HistoryItem {
  _id: string;
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  body?: string;
  response?: ResponseData;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore?: boolean; // For infinite scroll
}
