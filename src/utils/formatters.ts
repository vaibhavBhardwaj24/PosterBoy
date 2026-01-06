export function formatJSON(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(d);
}

export function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return "text-green-600 bg-green-50";
  if (status >= 300 && status < 400) return "text-blue-600 bg-blue-50";
  if (status >= 400 && status < 500) return "text-yellow-600 bg-yellow-50";
  if (status >= 500) return "text-red-600 bg-red-50";
  return "text-gray-600 bg-gray-50";
}

export function getMethodColor(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "text-blue-600 bg-blue-50";
    case "POST":
      return "text-green-600 bg-green-50";
    case "PUT":
      return "text-yellow-600 bg-yellow-50";
    case "DELETE":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

export function formatResponseTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
