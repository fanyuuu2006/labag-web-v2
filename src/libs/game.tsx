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
            <strong className="text-(--text-color-primary) font-semibold">
              遊戲目標
            </strong>
            <span className="ml-2">在有限次數內爭取最高分。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              玩法簡述
            </strong>
            <span className="ml-2">
              每次轉動產生 3 個圖案，依組合計分並累積至總分。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              計分規則
            </strong>
            <span className="ml-2">圖案組合決定得分，重點如下：</span>
          </>
        ),
        sub: [
          { content: "三個相同：獲得該圖案的最高分。" },
          {
            content:
              "兩個相同：獲得中等分 + 另一圖案的最低分，除以 1.4 後取整。",
          },
          { content: "皆不同：取三者最低分的平均值（取整）。" },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              結束條件
            </strong>
            <span className="ml-2">當可玩次數用盡，顯示最終成績。</span>
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
            <strong className="text-(--text-color-primary) font-semibold">
              觸發
            </strong>
            <span className="ml-2">
              當輪出現三個「gss」有機率觸發或累積次數達標時。
            </span>
          </>
        ),
        sub: [
          {
            content: `機率： ${
              game.getMode("greenwei")?.variable.rate
            }%；累積次數達 20 時自動觸發。`,
          },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              回合數
            </strong>
            <span className="ml-2">
              啟動時獲得基礎回合，期間可因條件增加回合。
            </span>
          </>
        ),
        sub: [{ content: "啟動獲得 +2 回合；再觸發每次 +2（可疊加）" }],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              效果
            </strong>
            <span className="ml-2">
              當輪「gss」會以「greenwei」顯示並套用加成。
            </span>
          </>
        ),
        sub: [{ content: "得分乘以 3（四捨五入）。" }],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              結束
            </strong>
            <span className="ml-2">綠光阿瑋次數歸零時自動退出模式。</span>
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
            <strong className="text-(--text-color-primary) font-semibold">
              觸發時機
            </strong>
            <span className="ml-2">遊玩次數用盡但本輪出現任一「kachu」。</span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              效果
            </strong>
            <span className="ml-2">
              每次觸發增加可玩次數，並替換顯示為 `pikachu`。
            </span>
          </>
        ),
        sub: [
          { content: "每次觸發回復 +5 次可玩次數（可累加）。" },
          { content: "當輪所有 `kachu` 顯示為 `pikachu`，以替換後計分。" },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              結束
            </strong>
            <span className="ml-2">
              當額外次數用盡且該輪未再出現 `kachu` 時結束遊戲。
            </span>
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
            <strong className="text-(--text-color-primary) font-semibold">
              啟動條件
            </strong>
            <span className="ml-2">當輪出現任意「hhh」且有機率觸發。</span>
          </>
        ),
        sub: [
          {
            content: `機率： ${
              game.getMode("superhhh")?.variable.rate
            }%；初次啟動獲得 6 回合。`,
          },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              超級回合規則
            </strong>
            <span className="ml-2">
              狀態期間可疊加回合，並可因特定條件延長。
            </span>
          </>
        ),
        sub: [{ content: "若回合結束時三格皆為 `hhh`，額外 +2 回合。" }],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              效果
            </strong>
          </>
        ),
        sub: [
          {
            content:
              "觸發當下三格皆為 `superhhh` 時，額外加分為當前總分的一半（四捨五入）。",
          },
          {
            content: "狀態期間的高分圖案機率大幅提升。",
          },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary) font-semibold">
              結束
            </strong>
            <span className="ml-2">超級阿禾次數歸零後自動退出模式。</span>
          </>
        ),
      },
    ],
  },
};
