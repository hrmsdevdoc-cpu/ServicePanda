import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getApiUrl } from "./apiConfig";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  let body;
  
  // Handle FormData (for file uploads) vs JSON data
  if (data instanceof FormData) {
    body = data;
    // Don't set Content-Type for FormData, let browser set it with boundary
  } else if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }
  
  // Add provider authentication header if available
  const providerId = localStorage.getItem('providerId');
  if (providerId && (url.includes('/api/provider/') || url.includes('/api/service-providers/'))) {
    headers['x-provider-id'] = providerId;
  }

  // Add customer authentication header if available
  // For customer endpoints, we'll use session-based auth instead of localStorage
  // The customer ID will be extracted from the session on the server side

  const res = await fetch(getApiUrl(url), {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

export async function adminApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers: Record<string, string> = {};
  let body;
  
  // Add admin authentication header
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    headers['x-admin-token'] = adminToken;
  }
  
  // Handle FormData vs JSON data
  if (data instanceof FormData) {
    body = data;
  } else if (data) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(data);
  }

  const res = await fetch(getApiUrl(url), {
    method,
    headers,
    body,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    const headers: Record<string, string> = {};
    
    // Add provider authentication header if available
    const providerId = localStorage.getItem('providerId');
    if (providerId && (url.includes('/api/provider/') || url.includes('/api/service-providers/'))) {
      headers['x-provider-id'] = providerId;
    }

    // Add customer authentication header if available
    // For customer endpoints, we'll use session-based auth instead of localStorage
    // The customer ID will be extracted from the session on the server side

    const res = await fetch(getApiUrl(url), {
      credentials: "include",
      headers,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 5 minutes instead of Infinity
      retry: false,
      retryOnMount: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: false,
    },
  },
});
