export async function fetcher<T>(
  ...args: Parameters<typeof fetch>
): Promise<T> {
  const res = await fetch(...args);
  return res.json();
}
