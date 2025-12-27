import { Detail } from "@/components/DetailItem";
import { cn } from "@/utils/className";
import { LaBaG, modeList, ModeName } from "labag";

export const game = new LaBaG(30);
modeList.forEach((mode) => game.addMode(mode));

const Badge = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "bg-(--background-color-primary) text-(--text-color-primary) py-1 px-2 rounded-lg font-semibold text-sm",
      className
    )}
    {...rest}
  />
);

const K = ({ className, ...rest }: React.HTMLAttributes<HTMLElement>) => (
  <strong className={cn("text-(--text-color-primary) font-extrabold", className)} {...rest} />
);

// game.addEventListener("gameStart", (g) => {
//   console.log("Game Started!");
//   console.log(`Total Rounds: ${g.times}\n`);
// });
// game.addEventListener("roundStart", (g) => {
//   console.log(`--- Round ${g.rounds} Start ---`);
// });
// game.addEventListener("rollSlots", (g) => {
//   const { modes, ranges } = g.getCurrentConfig();
//   console.log(`Active Modes: ${modes.map((m) => m.name).join(", ")}`);
//   console.log(
//     `Probability Ranges: ${ranges
//       .map((r) => `${r.pattern.name}<=${r.threshold}`)
//       .join(", ")}`
//   );
// });
// game.addEventListener("roundEnd", (g) => {
//   console.log(g.patterns.map((p) => (p ? p.name : "null")).join(" | "));
//   console.log(`Margin Score: ${g.marginScore}`);
//   console.log(`Score: ${g.score}\n`);
// });

export const description: Record<
  ModeName,
  { name: string; details: Detail[] }
> = {
  normal: {
    name: "普通模式",
    details: [
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>遊戲目標</Badge>
            <span>在有限次數內爭取最高分。</span>
          </div>
        ),
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>玩法簡述</Badge>
            <span>每次轉動產生 3 個圖案，依組合計分並累積至總分。</span>
          </div>
        ),
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>計分規則</Badge>
            <span>圖案組合決定得分，重點如下：</span>
          </div>
        ),
        sub: [
          { content: "三個相同：獲得該圖案的最高分。" },
          {
            content: (
              <>
                兩個相同：獲得中等分 + 另一圖案的最低分，除以 <K>1.4</K>{" "}
                後取整。
              </>
            ),
          },
          { content: "皆不同：取三者最低分的平均值（取整）。" },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>結束條件</Badge>
            <span>當可玩次數用盡，顯示最終成績。</span>
          </div>
        ),
      },
    ],
  },
  greenwei: {
    name: "綠光阿瑋模式",
    details: [
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>觸發</Badge>
            <span>當輪出現三個「gss」有機率觸發或累積次數達標時。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                機率： <K>{game.getMode("greenwei")?.variable.rate}</K>
                %；累積次數達 <K>20</K> 時自動觸發。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>回合數</Badge>
            <span>啟動時獲得基礎回合，期間可因條件增加回合。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                啟動獲得 <K>+2</K> 回合；再觸發每次 <K>+2</K>（可疊加）
              </>
            ),
          },
        ],
      },
      {
        content: (
          <>
            <Badge>效果</Badge>
          </>
        ),
        sub: [
          {
            content: (
              <>
                獲得分數提升 <K>2</K> 倍 (乘以<K>3</K>)
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>結束</Badge>
            <span>綠光阿瑋次數歸零時自動退出模式。</span>
          </div>
        ),
      },
    ],
  },
  pikachu: {
    name: "皮卡丘充電",
    details: [
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>觸發時機</Badge>
            <span>遊玩次數用盡時出現任一「kachu」。</span>
          </div>
        ),
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>效果</Badge>
            <span>每次觸發增加可玩次數，並替換顯示為 `pikachu`。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                每次觸發回復 <K>+5</K> 次可玩次數（可累加）。
              </>
            ),
          },
          { content: "當輪所有 `kachu` 顯示為 `pikachu`，以替換後計分。" },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>結束</Badge>
            <span>當額外次數用盡且該輪未再出現 `kachu` 時結束遊戲。</span>
          </div>
        ),
      },
    ],
  },
  superhhh: {
    name: "超級阿禾模式",
    details: [
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>啟動條件</Badge>
            <span>當輪出現任意「hhh」且有機率觸發。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                機率： <K>{game.getMode("superhhh")?.variable.rate}</K>
                %；初次啟動獲得 <K>6</K> 回合。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>超級回合規則</Badge>
            <span>狀態期間可疊加回合，並可因特定條件延長。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                若回合結束時三格皆為 `hhh`，額外 <K>+2</K> 回合。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <>
            <Badge>效果</Badge>
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
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>結束</Badge>
            <span>超級阿禾次數歸零後自動退出模式。</span>
          </div>
        ),
      },
    ],
  },
};
