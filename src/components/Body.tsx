"use client";
import { useModes } from "@/contexts/ModesContext";
import { forwardRef } from "react";

export const Body = forwardRef<
  HTMLBodyElement,
  React.HTMLAttributes<HTMLBodyElement>
>(({ ...props }, ref) => {
  const { modes } = useModes();
  // 有非normal模式时，使用第一个非normal模式的pattern作为主题，否则使用normal模式的pattern
  const theme = modes.find((m) => m.name !== "normal")?.name || "normal";
  return <body data-theme={theme} ref={ref} {...props} />;
});
Body.displayName = "Body";
