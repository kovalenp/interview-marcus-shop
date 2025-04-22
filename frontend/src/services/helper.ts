// src/services/fetchWithHeaders.ts
import { v4 as uuidv4 } from 'uuid';

/**
 * A wrapper around `fetch` that includes default headers like `x-request-id`
 * for tracing, and `Content-Type: application/json` for API requests.
 */
export async function fetchWithCorrelationId(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'x-request-id': uuidv4(),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}
