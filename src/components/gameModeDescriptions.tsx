import React from "react";
import { Detail } from "@/components/DetailItem";
import { cn } from "@/utils/className";
import { ModeName } from "labag";
import { game } from "@/libs/game";

const Badge = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "bg-(--primary-background) text-(--primary) py-1 px-2 rounded-lg font-semibold text-sm",
      className,
    )}
    {...rest}
  />
);

const Highlight = ({
  className,
  ...rest
}: React.HTMLAttributes<HTMLElement>) => (
  <strong
    className={cn("text-(--primary) font-extrabold", className)}
    {...rest}
  />
);

const Label = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-wrap gap-1 items-center">
    <Badge>{title}</Badge>
    <span>{children}</span>
  </div>
);

// Helper to access mode variables safely
const getVar = (name: ModeName) => game.getMode(name)?.variable;
const greenweiVar = getVar("greenwei");
const pikachuVar = getVar("pikachu");
const superhhhVar = getVar("superhhh");
const normalVar = getVar("normal");

const SuperHHHRates = () => {
  const rates = game.getMode("superhhh")?.rates || {};
  return (
    <div className="flex flex-col gap-1">
      {Object.entries(rates as Record<string, number>)
        .sort(([, a], [, b]) => b - a)
        .map(([pattern, rate]) => {
          const isPositive = rate > 0;
          return (
            <div key={pattern} className="flex items-center gap-1.5">
              <span className="capitalize">{pattern}</span>
              <span
                className={cn("font-mono", {
                  "text-green-400": isPositive,
                  "text-red-400": !isPositive,
                })}
              >
                {isPositive && "+"}
                {rate}%
              </span>
            </div>
          );
        })}
    </div>
  );
};

export const modeDescriptions: Record<
  ModeName,
  { name: string; details: Detail[] }
> = {
  normal: {
    name: "普通模式",
    details: [
      {
        content: <Label title="遊戲目標">在有限次數內爭取最高分。</Label>,
      },
      {
        content: (
          <Label title="玩法簡述">
            每次轉動產生 3 個圖案，依組合計分並累積至總分。
          </Label>
        ),
      },
      {
        content: <Label title="計分規則">圖案組合決定得分，重點如下：</Label>,
        sub: [
          { content: "三個相同：獲得該圖案的最高分。" },
          {
            content: (
              <>
                兩個相同：獲得中等分 + 另一圖案的最低分，除以{" "}
                <Highlight>{normalVar?.twoMatchDivisor}</Highlight> 後取整。
              </>
            ),
          },
          {
            content: (
              <>
                皆不同：取三者最低分的加總除以{" "}
                <Highlight>{normalVar?.allDifferentDivisor}</Highlight> 後取整。
              </>
            ),
          },
        ],
      },
      {
        content: <Label title="結束條件">當可玩次數用盡，顯示最終成績。</Label>,
      },
    ],
  },
  greenwei: {
    name: "綠光阿瑋模式",
    details: [
      {
        content: (
          <Label title="觸發">
            當輪出現三個「
            {greenweiVar?.bindPattern.name}
            」有機率觸發或累積次數達標時。
          </Label>
        ),
        sub: [
          {
            content: (
              <>
                機率： <Highlight>{greenweiVar?.rate}</Highlight>
                %；累積次數達{" "}
                <Highlight>
                  {greenweiVar?.requiredBindPatternCount}
                </Highlight>{" "}
                時自動觸發。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <Label title="回合數">
            觸發時獲得基礎回合，期間可因條件增加回合。
          </Label>
        ),
        sub: [
          {
            content: (
              <>
                啟動獲得 <Highlight>+{greenweiVar?.bonusTimes}</Highlight>{" "}
                回合；期間同時出現全
                {greenweiVar?.bindPattern.name}再
                <Highlight>+{greenweiVar?.extendTimes}</Highlight>
              </>
            ),
          },
        ],
      },
      {
        content: <Badge>效果</Badge>,
        sub: [
          {
            content: (
              <>
                獲得分數提升{" "}
                <Highlight>{(greenweiVar?.mutiplier ?? 1) - 1}</Highlight> 倍
                (乘以
                <Highlight>{greenweiVar?.mutiplier}</Highlight>)
              </>
            ),
          },
        ],
      },
      {
        content: <Label title="結束">綠光阿瑋次數歸零時自動退出模式。</Label>,
      },
    ],
  },
  pikachu: {
    name: "皮卡丘充電",
    details: [
      {
        content: (
          <Label title="觸發時機">
            遊玩次數用盡時出現任一「{pikachuVar?.bindPattern.name}」。
          </Label>
        ),
      },
      {
        content: <Badge>效果</Badge>,
        sub: [
          {
            content: (
              <>
                每次觸發 <Highlight>+{pikachuVar?.bonusRounds}</Highlight>{" "}
                次可玩次數。
              </>
            ),
          },
          {
            content: (
              <>
                模式期間若出現任一「{pikachuVar?.bindPattern.name}」，則額外增加{" "}
                <Highlight>
                  MIN(目前已觸發次數, {pikachuVar?.bonusRounds})
                </Highlight>{" "}
                次可玩次數。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <Label title="結束">
            當額外次數用盡且該輪未再出現 `{pikachuVar?.bindPattern.name}`
            時結束遊戲。
          </Label>
        ),
      },
    ],
  },
  superhhh: {
    name: "超級阿禾模式",
    details: [
      {
        content: (
          <Label title="觸發">
            當輪出現任意「{superhhhVar?.bindPattern.name}」且有機率觸發。
          </Label>
        ),
        sub: [
          {
            content: (
              <>
                機率： <Highlight>{superhhhVar?.rate}</Highlight>
                %；初次啟動獲得 <Highlight>
                  {superhhhVar?.bonusTimes}
                </Highlight>{" "}
                回合。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <Label title="回合數">
            觸發時獲得基礎回合，期間可因條件增加回合。
          </Label>
        ),
        sub: [
          {
            content: (
              <>
                若回合期間時三格皆為 `{superhhhVar?.bindPattern.name}`，額外{" "}
                <Highlight>+{superhhhVar?.extendTimes}</Highlight> 回合。
              </>
            ),
          },
        ],
      },
      {
        content: <Badge>效果</Badge>,
        sub: [
          {
            content: (
              <>
                {`觸發當下三格皆為 \`${
                  game.getMode("superhhh")?.name
                }\` 時，獲得額外加分`}
                <Highlight>(當前總分的一半)</Highlight>
              </>
            ),
          },
          {
            content: "狀態期間的高分圖案機率大幅提升，低分圖案機率大幅下降:",
            sub: [
              {
                content: <SuperHHHRates />,
              },
            ],
          },
        ],
      },
      {
        content: <Label title="結束">超級阿禾次數歸零後自動退出模式。</Label>,
      },
    ],
  },
};
