"use client";
import { useModal } from "@/hooks/useModal";
import { ModeName } from "labag";
import { createContext, useContext, useState, useMemo } from "react";
import { OverrideProps } from "fanyucomponents";
import { GlowText } from "@/components/GlowText";
import { DetailItem } from "@/components/DetailItem";
import { description } from "@/libs/game";

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
    [modal]
  );

  return (
    <modeModalContext.Provider value={value}>
      {children}
      <modal.Container
        data-theme={mode}
        className="bg-black/40 flex items-center justify-center p-6 z-50"
      >
        {mode ? (
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg card flex flex-col items-center p-4 sm:p-6 gap-4 animate-pop">
            <GlowText
              as="h3"
              className="text-2xl sm:text-3xl font-extrabold underline-spread"
            >
              {description[mode].name}
            </GlowText>

            <div className="p-2">
              {description[mode].details.map((detail, index) => (
                <DetailItem key={index} detail={detail} />
              ))}
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
