import { useCallback, useState } from "react";
import { useModal } from "./useModal";
import { ModeName } from "labag";
import { GlowText } from "@/components/GlowText";

const MODE_LABELS: Record<ModeName, string> = {
  normal: "普通模式",
  greenwei: "綠光阿瑋模式",
  pikachu: "皮卡丘充電",
  superhhh: "超級阿禾模式",
};

type Detail = {
  content: React.ReactNode;
  sub?: Detail[];
};

const DESCRIPTIONS: Record<ModeName, { details: Detail[] }> = {
  normal: {
    details: [
      {
        content: (
          <>
            <strong>遊戲目標：</strong>
            玩家在有限的遊玩次數內，透過每輪轉動拉霸機，獲得盡可能高的分數。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>基本流程：</strong>每場遊戲有固定的總遊玩次數（預設為 30
            次）。每次轉動會隨機產生 3 個圖案，並根據組合計算分數後累積至總分。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>圖案與分數：</strong>圖案種類為
            gss、hhh、hentai、handson、kachu、rrr。每種圖案有對應的分數設定，依照出現的組合給分。
          </>
        ),
        sub: [
          {
            content: "三個圖案相同：獲得該圖案的最高分（scores[0]）。",
          },
          {
            content:
              "兩個圖案相同：獲得該圖案的中等分（scores[1]）+ 另一圖案的最低分（scores[2]），再除以 1.4 並取整。",
          },
          {
            content: "三個圖案皆不同：三個圖案的最低分相加後，除以 3 並取整。",
          },
        ],
      },
      {
        content: (
          <>
            <strong>模式說明：</strong>
            普通模式（Normal）為基礎玩法，所有圖案出現機率依預設設定，無特殊加成或懲罰，適合新手與做為標準比對模式。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>結束條件：</strong>
            當遊玩次數用盡時，遊戲結束並顯示最終分數。
          </>
        ),
      },
    ],
  },
  greenwei: {
    details: [
      {
        content: (
          <>
            <strong>模式啟動：</strong>
            遊戲初始為未啟動狀態。每輪結束時，若三個圖案全為「gss」且以 35%
            機率觸發，或累積出現 20
            次「gss」圖案，則進入「綠光阿瑋」模式，並獲得 2 次「綠光阿瑋」回合。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>綠光阿瑋回合：</strong>啟動後進入「綠光阿瑋」狀態，預設持續
            2 回合，可疊加。每輪結束時若三個圖案全為「gss」，則額外獲得 2
            次「綠光阿瑋」回合。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>圖案替換：</strong>
            進入「綠光阿瑋」狀態時，當輪所有的「gss」圖案會被替換為「greenwei」圖案（視覺與計分以
            greenwei 為準）。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>分數加成：</strong>在「綠光阿瑋」狀態下，當輪分數會直接乘以
            3 倍（四捨五入）。
          </>
        ),
      },

      {
        content: (
          <>
            <strong>結束條件：</strong>
            當「綠光阿瑋」回合數歸零時，模式自動結束並回到普通模式。
          </>
        ),
      },
    ],
  },
  pikachu: {
    details: [
      {
        content: (
          <>
            <strong>模式啟動：</strong>
            遊戲結束時（遊玩次數用盡），若本輪有出現任意「kachu」圖案，則觸發皮卡丘充電模式。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>充電效果：</strong>
            觸發後，遊戲次數會增加5次（即玩家可額外再玩5次）。
            <br />
            皮卡丘充電模式可重複觸發，每次都會再增加5次。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>圖案替換：</strong>
            觸發時，當輪所有「kachu」圖案會被替換為「pikachu」圖案。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>結束條件：</strong>
            遊戲次數再次用盡且本輪未出現「kachu」圖案時，遊戲才會真正結束。
          </>
        ),
      },
    ],
  },
  superhhh: {
    details: [
      {
        content: (
          <>
            <strong>模式啟動：</strong>
            遊戲初始為未啟動狀態。每輪結束時，若本輪有出現任意數量的「hhh」圖案，且以
            15% 機率觸發，則進入「超級阿禾」模式，並獲得 6 次「超級阿禾」回合。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>超級阿禾回合：</strong>啟動後進入「超級阿禾」狀態，會持續 6
            回合；每輪結束時若三個圖案全為「hhh」，則額外獲得 2
            次「超級阿禾」回合。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>圖案替換：</strong>
            進入「超級阿禾」狀態時，當輪所有的「hhh」圖案會被替換為「superhhh」圖案（視覺與計分以
            superhhh 為準）。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>分數加成：</strong>若某輪出現 3 個
            `superhhh`，則觸發額外加分，額外分數為當前總分的一半（四捨五入）。
          </>
        ),
      },
      {
        content: (
          <>
            <strong>結束條件：</strong>
            當「超級阿禾」回合數歸零時，模式自動結束並回到普通模式。
          </>
        ),
      },
    ],
  },
};

const DetailItem = ({ detail }: { detail: Detail }) => {
  return (
    <li className="mb-2">
      <p>{detail.content}</p>
      {detail.sub && (
        <ul className="list-disc ml-5 mt-2 text-[0.8em]">
          {detail.sub.map((subDetail, index) => (
            <DetailItem key={index} detail={subDetail} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const useModeModal = () => {
  const [mode, setMode] = useState<ModeName | null>(null);
  const modal = useModal({});
  const open = useCallback(
    (m: ModeName) => {
      setMode(m);
      modal.open();
    },
    [modal]
  );

  const current = mode || "normal";

  const Content = mode && (
    <div className="max-w-md w-full card flex flex-col items-center p-6 gap-4 animate-pop">
      <GlowText as="h3" className="text-3xl font-extrabold underline-spread">
        {MODE_LABELS[current]}
      </GlowText>

      <div className="text-left w-full max-w-sm">
        <ul className="list-disc ml-5 text-(--text-color)">
          {DESCRIPTIONS[current].details.map((detail, index) => (
            <DetailItem key={index} detail={detail} />
          ))}
        </ul>
      </div>

      <div className="flex gap-3">
        <button
          className="btn-tertiary px-4 py-2 rounded-full"
          onClick={() => modal.close()}
        >
          我知道了
        </button>
      </div>
    </div>
  );

  return { ...modal, open, Content };
};
