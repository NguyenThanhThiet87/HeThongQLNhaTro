const REQUEST_ID_HEADER = "x-request-id";

const getUrl = (input) => {
  if (typeof input === "string") return input;
  return input?.url ?? "<unknown-url>";
};

const getMethod = (input, init) =>
  (init?.method ?? (typeof input === "object" ? input?.method : undefined) ?? "GET").toUpperCase();

const getRequestId = (headers) => {
  if (!headers) return undefined;
  if (typeof headers.get === "function") return headers.get(REQUEST_ID_HEADER);
  return headers[REQUEST_ID_HEADER] ?? headers["X-Request-ID"];
};

/**
 * Development-only diagnostics for mobile debugging.
 * It intentionally never logs authorization headers, request bodies, tokens, OTPs, or passwords.
 */
export function installDebugLogging() {
  if (!__DEV__ || global.__qlNhaTroDebugLoggingInstalled) return;

  global.__qlNhaTroDebugLoggingInstalled = true;

  const originalFetch = global.fetch;
  global.fetch = async (input, init) => {
    const method = getMethod(input, init);
    const url = getUrl(input);
    const startedAt = Date.now();

    console.info(`[HTTP] → ${method} ${url}`);

    try {
      const response = await originalFetch(input, init);
      const durationMs = Date.now() - startedAt;
      const requestId = getRequestId(response.headers);
      const outcome = response.ok ? "✓" : "✗";

      console.info(
        `[HTTP] ${outcome} ${method} ${url} · ${response.status} · ${durationMs}ms${requestId ? ` · requestId=${requestId}` : ""}`,
      );

      return response;
    } catch (error) {
      const durationMs = Date.now() - startedAt;
      console.error(`[HTTP] ✗ ${method} ${url} · network error · ${durationMs}ms`, error?.message ?? error);
      throw error;
    }
  };

  const previousHandler = global.ErrorUtils?.getGlobalHandler?.();
  global.ErrorUtils?.setGlobalHandler?.((error, isFatal) => {
    console.error(`[APP] ${isFatal ? "FATAL" : "ERROR"} Unhandled JavaScript error`, error);
    previousHandler?.(error, isFatal);
  });

  console.info("[APP] Development diagnostics enabled");
}
