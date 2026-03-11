"use client";
import { useModal } from "@/hooks/useModal";
import { ModeName } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { GlowText } from "@/components/GlowText";

import { game, modeDescriptions } from "@/libs/game";
import { MyMarkDown } from "@/components/MyMarkDown";
type ModeModalContextType = OverrideProps<
  ReturnType<typeof useModal>,
  {
    open: (mn: ModeName) => void;
  }
>;

const modeModalContext = createContext<ModeModalContextType | null>(null);

export const ModeModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mode, setMode] = useState<ModeName | null>(null);
  const modal = useModal({});

  const value = useMemo(
    () => ({
      ...modal,
      open: (mn: ModeName) => {
        modal.open();
        setMode(mn);
      },
    }),
    [modal],
  );

  const variables = useMemo(() => {
    const getVar = (name: ModeName) => game.getMode(name)?.variable;
    const greenweiVar = getVar("greenwei");
    const pikachuVar = getVar("pikachu");
    const superhhhVar = getVar("superhhh");
    const normalVar = getVar("normal");

    return {
      greenweiVar,
      pikachuVar,
      superhhhVar,
      normalVar,
    };
  }, []);

  return (
    <modeModalContext.Provider value={value}>
      {children}
      <modal.Container
        data-theme={mode}
        className="bg-black/40 flex items-center justify-center p-4 z-50"
      >
        {mode ? (
          <div className="w-full max-w-md md:max-w-lg card rounded-2xl flex flex-col items-center p-4 gap-4 animate-pop">
            <GlowText
              as="h3"
              className="text-2xl sm:text-3xl font-extrabold underline-spread"
            >
              {modeDescriptions[mode].name}
            </GlowText>

            <div className="w-full p-2 shrink-0">
              <MyMarkDown
                components={{
                  strong: ({ ...rest }) => (
                    <strong
                      className="bg-(--primary-background) text-(--primary) py-1 px-2 rounded-lg font-semibold"
                      {...rest}
                    />
                  ),
                }}
                variables={variables}
              >
                {modeDescriptions[mode].detail}
              </MyMarkDown>
            </div>

            <div className="flex w-full justify-center sm:justify-end">
              <button
                className="btn secondary px-4 py-2 rounded-full w-full sm:w-auto"
                onClick={() => modal.close()}
              >
                我知道了
              </button>
            </div>
          </div>
        ) : null}
      </modal.Container>
    </modeModalContext.Provider>
  );
};

export const useModeModal = () => {
  const context = useContext(modeModalContext);
  if (!context) {
    throw new Error("useModeModal 必須在 ModeModalProvider 內使用");
  }
  return context;
};
