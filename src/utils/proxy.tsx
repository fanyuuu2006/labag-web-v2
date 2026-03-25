import { fetcher as apiFetch } from "./fetcher";

// 支援的 HTTP 方法（必要時可擴充）
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

// 每個 endpoint 的描述：回傳型別與可選的 query 參數
type EndpointSpec = {
  res: unknown;
  query?: Record<string, unknown>;
};

// 將 Methods 規格抽成別名，避免重複寫 Partial<Record<...>>
type MethodsSpec = Partial<Record<HttpMethod, EndpointSpec>>;

type ApiRoute = {
  url: string;
  method?: MethodsSpec;
  subs?: readonly ApiRoute[];
};

type RouteList = readonly ApiRoute[];

// 輔助型別：將單一 `ApiRoute` 映射成鍵（字面或 string index）
type RouteKey<R extends ApiRoute> = R["url"] extends `:${string}` ? string : R["url"];

// 將陣列映射成物件：字面鍵與動態 string index 會合併在同一個型別
type NestedRoutes<S extends RouteList | undefined> = S extends RouteList
  ? { [R in S[number] as RouteKey<R>]: RouteProxy<R> }
  : object;

// 將 methods mapping 轉成對應的 handler 物件（不要在結尾索引，避免變成聯集）
type MethodHandlers<M extends MethodsSpec> = {
  [K in keyof M]: M[K] extends EndpointSpec
    ? (
        options?: (RequestInit & { method?: K }) & { query?: M[K]["query"] },
      ) => Promise<M[K]["res"]>
    : never;
};

type RouteProxy<T extends ApiRoute> = T["method"] extends MethodsSpec
  ? MethodHandlers<T["method"]> & NestedRoutes<T["subs"]>
  : NestedRoutes<T["subs"]>;

// 支援根路由為動態 segment（例如 ":id"）的情況：
// - 若 T.url 以 ':' 開頭，回傳型別會同時包含字面方法/子路由與 string index signature，
//   方便直接使用 `api['123'](...)` 並保有方法型別。
type RouteProxyRoot<T extends ApiRoute> = T["url"] extends `:${string}`
  ? { [param: string]: RouteProxy<T> } & RouteProxy<T>
  : RouteProxy<T>;

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
export const createApiProxy = <T extends ApiRoute>(
  basePath: string,
): RouteProxyRoot<T> => {
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
      if (
        typeof requestOptions !== "object" ||
        requestOptions === null ||
        !("method" in requestOptions)
      ) {
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
  return callableProxy as unknown as RouteProxyRoot<T>;
};
