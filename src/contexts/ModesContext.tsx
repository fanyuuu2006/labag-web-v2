"use client";
import { game } from "@/libs/game";
import { createContext, useContext, useState, useMemo, useEffect } from "react";

type Modes = typeof game.modes;

interface ModesContextType {
  modes: Modes;
}

const ModesContext = createContext<ModesContextType | null>(null);

export const ModesProvider = ({ children }: { children: React.ReactNode }) => {
  const { modes: initialModes } = game.getCurrentConfig();
  const [modes, setModes] = useState<Modes>(initialModes);

  useEffect(() => {
    const handleGameStart = (g: typeof game) => {
      const { modes: newModes } = g.getCurrentConfig();
      setModes(newModes);
    };

    const handleRoundEnd = (g: typeof game) => {
      const { modes: newModes } = g.getCurrentConfig();
      setTimeout(() => setModes(newModes), 3000);
    };

    game.addEventListener("gameStart", handleGameStart);
    game.addEventListener("roundEnd", handleRoundEnd);

    return () => {
      game.removeEventListener("gameStart", handleGameStart);
      game.removeEventListener("roundEnd", handleRoundEnd);
    };
  }, []);

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
