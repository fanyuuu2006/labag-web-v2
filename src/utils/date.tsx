export const formatDate = (
  ...args: ConstructorParameters<typeof Date>
): string => {
  const date = new Date(...args);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};
