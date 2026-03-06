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

export const modeDescriptions: Record<
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
                兩個相同：獲得中等分 + 另一圖案的最低分，除以{" "}
                <Highlight>1.4</Highlight> 後取整。
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
            <span>
              當輪出現三個「
              {game.getMode("greenwei")?.variable.bindPattern.name}
              」有機率觸發或累積次數達標時。
            </span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                機率：{" "}
                <Highlight>{game.getMode("greenwei")?.variable.rate}</Highlight>
                %；累積次數達{" "}
                <Highlight>
                  {game.getMode("greenwei")?.variable.requiredBindPatternCount}
                </Highlight>{" "}
                時自動觸發。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>回合數</Badge>
            <span>觸發時獲得基礎回合，期間可因條件增加回合。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                啟動獲得{" "}
                <Highlight>
                  +{game.getMode("greenwei")?.variable.bonusTimes}
                </Highlight>{" "}
                回合；期間同時出現全
                {game.getMode("greenwei")?.variable.bindPattern.name}再
                <Highlight>
                  +{game.getMode("greenwei")?.variable.extendTimes}
                </Highlight>
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
                獲得分數提升{" "}
                <Highlight>
                  {(game.getMode("greenwei")?.variable.mutiplier ?? 1) - 1}
                </Highlight>{" "}
                倍 (乘以
                <Highlight>
                  {game.getMode("greenwei")?.variable.mutiplier}
                </Highlight>
                )
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
            <span>
              遊玩次數用盡時出現任一「
              {game.getMode("pikachu")?.variable.bindPattern.name}」。
            </span>
          </div>
        ),
      },
      {
        content: <Badge>效果</Badge>,
        sub: [
          {
            content: (
              <>
                每次觸發{" "}
                <Highlight>
                  +{game.getMode("pikachu")?.variable.bonusRounds}
                </Highlight>{" "}
                次可玩次數。
              </>
            ),
          },
          {
            content: (
              <>
                模式期間若出現任一「
                {game.getMode("pikachu")?.variable.bindPattern.name}
                」，則額外增加{" "}
                <Highlight>
                  MIN(目前已觸發次數,{" "}
                  {game.getMode("pikachu")?.variable.bonusRounds})
                </Highlight>{" "}
                次可玩次數。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>結束</Badge>
            <span>
              當額外次數用盡且該輪未再出現 `
              {game.getMode("pikachu")?.variable.bindPattern.name}` 時結束遊戲。
            </span>
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
            <Badge>觸發</Badge>
            <span>
              當輪出現任意「
              {game.getMode("superhhh")?.variable.bindPattern.name}
              」且有機率觸發。
            </span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                機率：{" "}
                <Highlight>{game.getMode("superhhh")?.variable.rate}</Highlight>
                %；初次啟動獲得{" "}
                <Highlight>
                  {game.getMode("superhhh")?.variable.bonusTimes}
                </Highlight>{" "}
                回合。
              </>
            ),
          },
        ],
      },
      {
        content: (
          <div className="flex flex-wrap gap-1 items-center">
            <Badge>回合數</Badge>
            <span>觸發時獲得基礎回合，期間可因條件增加回合。</span>
          </div>
        ),
        sub: [
          {
            content: (
              <>
                若回合期間時三格皆為 `
                {game.getMode("superhhh")?.variable.bindPattern.name}`，額外{" "}
                <Highlight>
                  +{game.getMode("superhhh")?.variable.extendTimes}
                </Highlight>{" "}
                回合。
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
                {`觸發當下三格皆為 \`${
                  game.getMode("superhhh")?.name
                }\` 時，獲得額外加分`}
                <Highlight>(當前總分的一半)</Highlight>
              </>
            ),
          },
          {
            content: "狀態期間的高分圖案機率大幅提升。",
            sub: [
              {
                content: (
                  <div className="flex flex-col gap-1">
                    {Object.entries(game.getMode("superhhh")?.rates || {})
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
                ),
              },
            ],
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
