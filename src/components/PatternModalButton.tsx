"use client";
import { usePatternModal } from "@/contexts/PatternModalContext";
import { OverrideProps } from "fanyucomponents";
import { Pattern } from "labag";
import { memo, useCallback } from "react";

export type PatternModalButtonProps = OverrideProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  {
    pattern: Pattern;
  }
>;

export const PatternModalButton = memo(
  ({ pattern, onClick, ...rest }: PatternModalButtonProps) => {
    const pm = usePatternModal();
    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        pm.open(pattern);
        onClick?.(e);
      },
      [pm, pattern, onClick],
    );

    return <button onClick={handleClick} {...rest} />;
  },
);

PatternModalButton.displayName = "PatternModalButton";
