import { useCallback, useState } from "react";
import { useModal } from "./useModal";
import { ModeName } from "labag";
import { MyImage } from "@/components/MyImage";

export const useModeModal = () => {
  const [mode, setMode] = useState<ModeName | null>(null);
  const modal = useModal({});
  const open = useCallback(
    (mode: ModeName) => {
      setMode(mode);
      modal.open();
    },
    [modal]
  );
  const Content = (
    <>
    
    </>
  );
  return { ...modal, open, Content };
};
