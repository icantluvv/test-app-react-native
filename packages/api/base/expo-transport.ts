import { fetch } from "expo/fetch";
import type { ResolvedRequest, Transport, TransportResult } from "./codegen/.kubb/client";
import { handleUnauthorized } from "./client-handlers";
import { getMockResponse, tryGetMockResponse } from "./mock-client";

export interface ExpoTransportOptions {
  // Explicit opt-in; missing mock routes fail instead of reaching a real backend.
  mockScenario?: string;
  unauthorizedRetry?: boolean;
  // Read-only fallback on network failures or 5xx. false disables it.
  mockFallbackScenario?: string | false;
}

function absoluteURL(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const baseURL = process.env.EXPO_PUBLIC_API_URL;
  if (!baseURL || !/^https?:\/\//i.test(baseURL)) {
    throw new Error("Client base URL must be an absolute HTTP(S) URL");
  }
  return `${baseURL.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}

async function parseResponse(response: Response, type: ResolvedRequest["responseType"]) {
  if ([204, 205, 304].includes(response.status)) return undefined;
  if (type === "stream") return response.body;
  if (type === "blob") return response.blob();
  if (type === "arraybuffer") return response.arrayBuffer();
  const contentType = response.headers.get("Content-Type") ?? "";
  if (type === "text" || type === "document") return response.text();
  if (
    !type &&
    (contentType.startsWith("image/") || contentType.includes("application/octet-stream"))
  ) {
    return response.blob();
  }
  if (!type && contentType.includes("text/event-stream")) return response.body;
  const text = await response.text();
  if (!text) return undefined;
  if (type === "json" || contentType.includes("json")) return JSON.parse(text) as unknown;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export function createExpoTransport(options: ExpoTransportOptions = {}): Transport {
  async function send(request: ResolvedRequest): Promise<TransportResult> {
    request.signal?.throwIfAborted();
    const init: RequestInit = {
      ...request.options,
      method: request.method,
      headers: request.headers,
      body: request.body,
      signal: request.signal,
      credentials: request.credentials,
    };
    // Pass FormData directly. Never set its multipart boundary manually.
    const nativeRequest = new Request(request.url, init);
    const fallback = async () => {
      request.signal?.throwIfAborted();
      if (
        !["GET", "HEAD"].includes(request.method.toUpperCase()) ||
        options.mockFallbackScenario === false
      ) {
        return undefined;
      }
      return tryGetMockResponse(request, options.mockFallbackScenario ?? "default");
    };
    let response: Response;
    if (options.mockScenario) {
      response = await getMockResponse(request, options.mockScenario);
    } else {
      try {
        response = await fetch(request.url, init);
      } catch (error) {
        request.signal?.throwIfAborted();
        if (error instanceof Error && error.name === "AbortError") throw error;
        const mock = await fallback();
        if (!mock) throw error;
        response = mock;
      }
      if (response.status >= 500 && response.status <= 599) {
        response = (await fallback()) ?? response;
      }
    }
    request.signal?.throwIfAborted();
    return {
      data: await parseResponse(response, request.responseType),
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      contentType: response.headers.get("Content-Type")?.split(";")[0]?.trim(),
      request: nativeRequest,
      response,
    };
  }

  return async (resolved) => {
    const request = { ...resolved, url: absoluteURL(resolved.url) };
    let result = await send(request);
    const replayable = !(
      typeof ReadableStream !== "undefined" && request.body instanceof ReadableStream
    );
    if (result.status === 401 && options.unauthorizedRetry !== false && replayable) {
      const headers = await handleUnauthorized(request);
      request.signal?.throwIfAborted();
      if (headers != null) {
        const retryHeaders = new Headers(request.headers);
        new Headers(headers).forEach((value, key) => retryHeaders.set(key, value));
        result = await send({ ...request, headers: Object.fromEntries(retryHeaders.entries()) });
      }
    }
    // Kubb owns HTTP errors and Zod validation after the transport returns.
    return result;
  };
}
