import { DateFormatToken } from "@/types";

/**
 * 格式化日期字串
 * @param format 格式字串 (YYYY:年, MM:月, DD:日, HH:24時, hh:12時, mm:分, ss:秒, A:AM/PM)
 * @param args Date 建構參數
 * @returns 格式化後的字串
 */
export const formatDate = (
  format: string,
  ...args: ConstructorParameters<typeof Date>
): string => {
  const date = new Date(...args);

  const _pad = (n: number) => String(n).padStart(2, "0");
  const hours = date.getHours();

  const map: Record<DateFormatToken, string> = {
    YYYY: String(date.getFullYear()),
    MM: _pad(date.getMonth() + 1),
    DD: _pad(date.getDate()),
    HH: _pad(hours),
    hh: _pad(hours % 12 || 12),
    mm: _pad(date.getMinutes()),
    ss: _pad(date.getSeconds()),
    A: hours >= 12 ? "PM" : "AM",
  };

  return format.replace(
    /YYYY|MM|DD|HH|hh|mm|ss|A/g,
    (token) => map[token as DateFormatToken],
  );
};