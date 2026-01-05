export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);
  if (!res.ok) {
    console.error("Fetch 錯誤：", res.statusText);
  }
  return res.json();
}
