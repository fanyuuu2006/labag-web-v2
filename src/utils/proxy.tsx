import { fetcher as apiFetch } from "./fetcher";

// 支援的 HTTP 方法（必要時可擴充）
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 每個 endpoint 的描述：回傳型別與可選的 query 參數
type EndpointSpec = {
  res: unknown;
  query?: Record<string, unknown>;
};

type ApiRoute = {
  url: string;
  method?: Partial<Record<HttpMethod, EndpointSpec>>;
  subs?: readonly ApiRoute[];
};

type NestedRoutes<S extends readonly ApiRoute[] | undefined> =
  S extends readonly ApiRoute[]
    ? {
        [R in S[number] as R["url"]]: RouteProxy<R>;
      }
    : object;

type MethodHandlers<M extends Partial<Record<HttpMethod, EndpointSpec>>> = {
  [K in keyof M]: M[K] extends EndpointSpec
    ? (
        options?: (RequestInit & { method?: K }) & { query?: M[K]["query"] },
      ) => Promise<M[K]["res"]>
    : never;
}[keyof M];

type RouteProxy<T extends ApiRoute> =
  T["method"] extends Partial<Record<HttpMethod, EndpointSpec>>
    ? MethodHandlers<T["method"]> & NestedRoutes<T["subs"]>
    : NestedRoutes<T["subs"]>;

// 將 query 物件序列化為查詢字串（支援陣列與物件）
function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const pairs: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const v of value) {
        pairs.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
        );
      }
    } else if (typeof value === "object") {
      pairs.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`,
      );
    } else {
      pairs.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  }
  return pairs.length ? `?${pairs.join("&")}` : "";
}

// 建立 API Proxy 的工廠函式：會快取子 proxy 並處理特殊屬性
export const createApiProxy = <T extends ApiRoute>(basePath: string): RouteProxy<T> => {
  const childProxyCache = new Map<string | symbol, unknown>();

  const proxyHandler: ProxyHandler<object> = {
    get(_target, prop) {
      // 處理一些 JS/inspect 與 promise 判斷相關的屬性，避免被誤當作 Promise
      if (prop === Symbol.toStringTag || prop === Symbol.toPrimitive) {
        return undefined;
      }
      if (prop === "then") {
        return undefined;
      }
      if (prop === "toString") {
        return () => basePath;
      }

      const propKey = prop;
      if (childProxyCache.has(propKey)) return childProxyCache.get(propKey);

      const childProxy = createApiProxy(`${basePath}/${String(prop)}`);
      childProxyCache.set(propKey, childProxy);
      return childProxy;
    },
    apply(_target, _thisArg, args: unknown[]) {
      const requestOptions = args[0] || {};
      if (typeof requestOptions !== "object" || requestOptions === null || !("method" in requestOptions)) {
        throw new Error(
          "請求參數必須為包含 method 的物件，例如 { method: 'GET' }",
        );
      }

      const { query, ...requestInit } = requestOptions as {
        query?: Record<string, unknown>;
      } & RequestInit;
      const queryString = buildQueryString(query);

      // 直接呼叫 apiFetch，requestInit 會被當作 RequestInit 傳入
      return apiFetch(`${basePath}${queryString}`, {
        ...requestInit,
      } as RequestInit);
    },
  };

  // 使用一個空函式作為 callable target，並套上 handler
  const callableProxy = new Proxy(() => {}, proxyHandler);
  return callableProxy as unknown as RouteProxy<T>;
};

// 保留舊匯出名稱以免中斷相依性
