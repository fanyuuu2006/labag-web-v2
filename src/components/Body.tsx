"use client";
import { useSetting } from "@/contexts/SettingContext";
import { forwardRef } from "react";

export const Body = forwardRef<
  HTMLBodyElement,
  React.HTMLAttributes<HTMLBodyElement>
>(({ ...props }, ref) => {
  const { settings } = useSetting();
  return <body data-theme={settings.theme} ref={ref} {...props} />;
});
Body.displayName = "Body";
