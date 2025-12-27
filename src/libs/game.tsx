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
            <strong className="text-(--text-color-primary)">遊戲目標：</strong>
            <span className="ml-2">
              在有限次數內爭取最高分，適合初學者與常規對戰。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">玩法簡述：</strong>
            <span className="ml-2">
              每次轉動會產生 3 個圖案，依組合計分並累積至總分；遊戲次數有限。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">計分規則：</strong>
            <span className="ml-2">圖案組合決定得分，常見情況如下：</span>
          </>
        ),
        sub: [
          { content: "三個相同：獲得該圖案的最高分。" },
          { content: "兩個相同：獲得中等分 + 另一圖案的最低分，結果會取整。" },
          { content: "皆不同：取三者最低分平均並取整。" },
        ],
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">適用情境：</strong>
            <span className="ml-2">
              標準玩法，無額外加成，適合作為基準模式。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束條件：</strong>
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
            <strong className="text-(--text-color-primary)">觸發方式：</strong>
            <span className="ml-2">
              當輪出現三個「gss」且命中機率或累積達成門檻即會啟動。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">綠光回合：</strong>
            <span className="ml-2">
              啟動後贈予數回合（可疊加），期間 gss 會替換為 greenwei。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">加成效果：</strong>
            <span className="ml-2">
              所有該回合得分會乘以 3（四捨五入），提高高分機會。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束：</strong>
            <span className="ml-2">期數耗盡後回到普通模式。</span>
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
            <strong className="text-(--text-color-primary)">觸發時機：</strong>
            <span className="ml-2">
              遊玩次數用盡後，若本輪出現任一「kachu」則啟動充電。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">充電效果：</strong>
            <span className="ml-2">
              每次觸發額外增加 5 次遊玩。可重複累加。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">視覺/計分：</strong>
            <span className="ml-2">
              觸發時該輪的 kachu 會替換為 pikachu（視覺與計分以替換後為準）。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束：</strong>
            <span className="ml-2">
              若額外遊玩次數用盡且本輪未再出現 kachu，則遊戲結束。
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
            <strong className="text-(--text-color-primary)">觸發機率：</strong>
            <span className="ml-2">
              當輪出現 hhh 並命中機率時會啟動，啟動時贈予多回合。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">超級回合：</strong>
            <span className="ml-2">
              啟動後會有數回合效果，期間 hhh 會替換為 superhhh 並可疊加回合。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">特殊加成：</strong>
            <span className="ml-2">
              若回合出現 3 個 superhhh，將給予額外分數（依當前總分計算）。
            </span>
          </>
        ),
      },
      {
        content: (
          <>
            <strong className="text-(--text-color-primary)">結束：</strong>
            <span className="ml-2">期數耗盡後回到普通模式。</span>
          </>
        ),
      },
    ],
  },
};
