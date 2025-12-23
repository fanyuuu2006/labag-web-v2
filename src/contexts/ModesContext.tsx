"use client";
import { createContext, useContext } from "react";
import { labag } from "labag";

const ModesContext = createContext<{
  modes: typeof labag.modes;
} | null>(null);

export const ModesProvider = ({ children }: { children: React.ReactNode }) => {
  const { modes } = labag.getCurrentConfig();
  return (
    <ModesContext.Provider value={{ modes }}>{children}</ModesContext.Provider>
  );
};
export const useModes = () => {
  const context = useContext(ModesContext);
  if (!context) {
    throw new Error("useModes 必須在 ModesProvider 內使用");
  }
  return context;
};
