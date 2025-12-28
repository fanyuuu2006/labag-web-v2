import { game } from "@/libs/game";
import { useCallback } from "react";
import { recorder } from "../../libs/recorder";

/**
 * `DownloadRecordButton` 的 props。
 * 擴充自原生按鈕屬性，可接受 `className`、`style` 等。
 */
type DownloadRecordButtonProps = React.HTMLAttributes<HTMLButtonElement>;

/**
 * 下載遊戲紀錄（JSON 檔案）的按鈕元件。
 *
 * 行為：
 * - 按下時會先呼叫可選的 `onClick` prop。
 * - 會將 `recorder.getRecords()` 序列化為 JSON，並啟動下載。
 *   檔名格式為 `labag_YYYYMMDD_<score>.json`，其中 `<score>` 於點擊時從
 *   匯入的 `game.score` 取得。
 *
 * @param props 標準按鈕屬性；若提供 `onClick`，會先呼叫該函式再執行下載。
 */
export const DownloadRecordButton = ({
  onClick,
  ...rest
}: DownloadRecordButtonProps) => {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (recorder.getRecords().length < game.times) {
        alert("目前沒有可下載的遊戲紀錄喔！");
        return;
      }

      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10).replace(/-/g, ""); // 轉成 YYYYMMDD
      const fileName = `labag_${formattedDate}_${game.score}.json`;

      const records = recorder.getRecords();
      const jsonString = JSON.stringify(records, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();

      URL.revokeObjectURL(url);
    },
    [onClick]
  );

  return <button onClick={handleClick} {...rest} />;
};
