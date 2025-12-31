export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);
  if (!res.ok) {
    throw new Error("Fetch error");
  }
  return res.json();
}
