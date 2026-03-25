import { fetcher } from "./fetcher";

// 支援的 HTTP 方法（必要時可擴充）
type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 每個 endpoint 的描述：回傳型別與可選的 query 參數
type Endpoint = {
  res: unknown;
  query?: Record<string, unknown>;
};

type Route = {
  url: string;
  method?: Partial<Record<Method, Endpoint>>;
  subs?: readonly Route[];
};

type SubRoutes<S extends readonly Route[] | undefined> =
  S extends readonly Route[]
    ? {
        [R in S[number] as R["url"]]: ProxyFetcher<R>;
      }
    : object;

type FetcherFunction<M extends Partial<Record<Method, Endpoint>>> = {
  [K in keyof M]: M[K] extends Endpoint
    ? (
        options?: (RequestInit & { method?: K }) & { query?: M[K]["query"] },
      ) => Promise<M[K]["res"]>
    : never;
}[keyof M];

type ProxyFetcher<T extends Route> =
  T["method"] extends Partial<Record<Method, Endpoint>>
    ? FetcherFunction<T["method"]> & SubRoutes<T["subs"]>
    : SubRoutes<T["subs"]>;

// 將 query 物件序列化為查詢字串（支援陣列與物件）
function serializeQuery(q?: Record<string, unknown>): string {
  if (!q) return "";
  const parts: string[] = [];
  for (const [key, value] of Object.entries(q)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        parts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
        );
      }
    } else if (typeof value === "object") {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
      );
    } else {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

// 建立 Proxy 的工廠函式：會快取子 proxy 並處理特殊屬性
export const createProxy = <T extends Route>(url: string): ProxyFetcher<T> => {
  const childCache = new Map<string | symbol, unknown>();

  const handler: ProxyHandler<object> = {
    get(_target, prop) {
      // 處理一些 JS/inspect 與 promise 判斷相關的屬性，避免被誤當作 Promise
      if (prop === Symbol.toStringTag || prop === Symbol.toPrimitive) {
        return undefined;
      }
      if (prop === "then") {
        return undefined;
      }
      if (prop === "toString") {
        return () => url;
      }

      const key = prop;
      if (childCache.has(key)) return childCache.get(key);

      const child = createProxy(`${url}/${String(prop)}`);
      childCache.set(key, child);
      return child;
    },
    apply(_target, _thisArg, args: unknown[]) {
      const options = args[0] || {};
      if (typeof options !== "object" || options === null || !("method" in options)) {
        throw new Error(
          "請求參數必須為包含 method 的物件，例如 { method: 'GET' }",
        );
      }

      const { query, ...rest } = options as {
        query?: Record<string, unknown>;
      } & RequestInit;
      const queryString = serializeQuery(query);

      // 直接呼叫 fetcher，rest 會被當作 RequestInit 傳入
      return fetcher(`${url}${queryString}`, {
        ...rest,
      } as RequestInit);
    },
  };

  // 使用一個空函式作為 callable target，並套上 handler
  const proxy = new Proxy(() => {}, handler);
  return proxy as unknown as ProxyFetcher<T>;
};
