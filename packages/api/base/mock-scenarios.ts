import type { ResolvedRequest } from "./codegen/.kubb/client";

export interface MockResponse {
  data?: unknown;
  status?: number;
  headers?: HeadersInit;
}

export interface MockRoute {
  method: string;
  pattern: RegExp;
  create: (request: ResolvedRequest) => MockResponse | Promise<MockResponse>;
}

// Populate only with operations from this project's real API contract.
export const mockScenarios: Record<string, readonly MockRoute[]> = {
  default: [],
};
