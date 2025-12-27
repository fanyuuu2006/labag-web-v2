import { Detail } from "@/components/DetailItem";
import { LaBaG, modeList, ModeName } from "labag";

export const game = new LaBaG(30);
modeList.forEach((mode) => game.addMode(mode));

game.addEventListener("gameStart", (g) => {
  console.log("Game Started!");
  console.log(`Total Rounds: ${g.times}\n`);
});
game.addEventListener("roundStart", (g) => {
  console.log(`--- Round ${g.rounds} Start ---`);
});
game.addEventListener("rollSlots", (g) => {
  const { modes, ranges } = g.getCurrentConfig();
  console.log(`Active Modes: ${modes.map((m) => m.name).join(", ")}`);
  console.log(
    `Probability Ranges: ${ranges
      .map((r) => `${r.pattern.name}<=${r.threshold}`)
      .join(", ")}`
  );
});
game.addEventListener("roundEnd", (g) => {
  console.log(g.patterns.map((p) => (p ? p.name : "null")).join(" | "));
  console.log(`Margin Score: ${g.marginScore}`);
  console.log(`Score: ${g.score}\n`);
});

export const description: Record<
  ModeName,
  { name: string; details: Detail[] }
> = {
  normal: {
    name: "普通模式",
    details: [
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">遊戲目標:</strong>
            <span className="ml-2">在有限次數內爭取最高分。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">玩法簡述:</strong>
            <span className="ml-2">
              每次轉動會產生 3 個圖案，依組合計分並累積至總分；遊戲次數有限。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">計分規則:</strong>
            <span className="ml-2">圖案組合決定得分，常見情況如下:</span>
          </>
        ),
        sub: [
          { content: "三個相同:獲得該圖案的最高分。" },
          { content: "兩個相同:獲得中等分 + 另一圖案的最低分，除以1.4後取整。" },
          { content: "皆不同:取三者最低分平均並取整。" },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束條件:</strong>
            <span className="ml-2">遊玩次數用盡時顯示最終成績。</span>
          </>
        ),
      },
    ],
  },
  greenwei: {
    name: "綠光阿瑋模式",
    details: [
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">觸發:</strong>
            <span className="ml-2">當輪三個為「gss」且命中機率（35%）或累積出現達 20 次時啟動。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">回合數:</strong>
            <span className="ml-2">啟動時獲得 2 回合，期間每次再出現三個「gss」可額外 +2 回合（可疊加）。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">圖案替換:</strong>
            <span className="ml-2">啟動當輪所有「gss」以「greenwei」顯示（視覺與計分以替換後為準）。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">分數:</strong>
            <span className="ml-2">該回合得分乘以 3（四捨五入）。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束:</strong>
            <span className="ml-2">綠光回合歸零後返回普通模式。</span>
          </>
        ),
      },
    ],
  },
  pikachu: {
    name: "皮卡丘充電",
    details: [
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">觸發時機:</strong>
            <span className="ml-2">當遊玩次數用盡且本輪出現任一「kachu」時觸發。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">效果:</strong>
            <span className="ml-2">每次觸發回退 5 次遊玩（即增加 5 次可玩次數），可重複累加。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">圖案替換:</strong>
            <span className="ml-2">觸發當輪所有「kachu」以「pikachu」顯示（視覺與計分以替換後為準）。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束:</strong>
            <span className="ml-2">當額外次數用盡且該輪未出現「kachu」時遊戲才真正結束。</span>
          </>
        ),
      },
    ],
  },
  superhhh: {
    name: "超級阿禾模式",
    details: [
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">啟動條件:</strong>
            <span className="ml-2">當輪出現任意「hhh」且命中機率（15%）時啟動；初次啟動獲得 6 回合。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">超級回合規則:</strong>
            <span className="ml-2">進入狀態後持續該回合數（可疊加）；若回合結束時三格全為「hhh」，額外 +2 回合。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">圖案替換:</strong>
            <span className="ml-2">進入超級阿禾狀態時，當輪所有「hhh」以「superhhh」顯示並計分。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">分數加成:</strong>
            <span className="ml-2">當回合三格皆為 `superhhh` 時，額外加分為當前總分的一半（四捨五入）。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束:</strong>
            <span className="ml-2">當超級阿禾回合數歸零後回到普通模式。</span>
          </>
        ),
      },
    ],
  },
};
