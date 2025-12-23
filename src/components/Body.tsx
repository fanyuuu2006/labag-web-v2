"use client";
import { useModes } from "@/contexts/ModesContext";
import { forwardRef } from "react";

export const Body = forwardRef<
  HTMLBodyElement,
  React.HTMLAttributes<HTMLBodyElement>
>(({ ...props }, ref) => {
  const { modes } = useModes();
  return <body data-theme={modes[0].name} ref={ref} {...props} />;
});
Body.displayName = "Body";
