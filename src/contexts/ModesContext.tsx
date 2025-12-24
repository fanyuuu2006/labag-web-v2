"use client";
import { game } from "@/libs/game";
import { createContext, useContext, useState, useMemo } from "react";

type Modes = typeof game.modes;

interface ModesContextType {
  modes: Modes;
}

const ModesContext = createContext<ModesContextType | null>(null);

export const ModesProvider = ({ children }: { children: React.ReactNode }) => {
  const { modes: initialModes } = game.getCurrentConfig();
  const [modes, setModes] = useState<Modes>(initialModes);
  game.addEventListener("gameStart", (g) => {
    const { modes: newModes } = g.getCurrentConfig();
    setModes(newModes);
  });

  game.addEventListener("roundEnd", (g) => {
    const { modes: newModes } = g.getCurrentConfig();
    setTimeout(() => setModes(newModes), 3000);
  });

  const value = useMemo(
    () => ({
      modes,
    }),
    [modes]
  );

  return (
    <ModesContext.Provider value={value}>{children}</ModesContext.Provider>
  );
};

export const useModes = () => {
  const context = useContext(ModesContext);
  if (!context) {
    throw new Error("useModes 必須在 ModesProvider 內使用");
  }
  return context;
};
