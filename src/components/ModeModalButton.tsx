"use client";
import { useModeModal } from "@/contexts/ModeModalContext";
import { OverrideProps } from "fanyucomponents";
import { ModeName } from "labag";
import { memo, useCallback } from "react";

export type ModeModalButtonProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    modeName: ModeName;
  }
>;

export const ModeModalButton = memo(
  ({ modeName, onClick, ...rest }: ModeModalButtonProps) => {
    const mm = useModeModal();
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        mm.open(modeName);
        onClick?.(e);
      },
      [mm, modeName, onClick],
    );

    return <button onClick={handleClick} {...rest} />;
  },
);

ModeModalButton.displayName = "ModeModalButton";
