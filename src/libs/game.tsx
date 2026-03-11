import { LaBaG, ModeName, modes, Recorder } from "labag";

export const game = new LaBaG(30);
export const recorder = new Recorder(game);
modes.forEach((mode) => game.addMode(mode));

// 模式說明 使用類md語法
export const modeDescriptions: Record<
  ModeName,
  { name: string; detail: string }
> = {
  normal: {
    name: "普通模式",
    detail: `
**遊戲目標** 在有限次數內爭取最高分。

**玩法簡述** 每次轉動產生 3 個圖案，依組合計分並累積至總分。

**計分規則** 圖案組合決定得分。 
  - 三個相同 獲得該圖案的最高分。
  - 兩個相同 獲得中等分 + 另一圖案的最低分，除以 \`$normalVar.twoMatchDivisor$\` 後取整。
  - 皆不同 取三者最低分的加總除以 \`$normalVar.allDifferentDivisor$\` 後取整。

**結束條件** 當可玩次數用盡，顯示最終成績。

**備註** 遊戲過程中可獲得特殊模式，詳見其他模式說明。
`,
  },
  greenwei: {
    name: "綠光阿瑋模式",
    detail: `
**觸發** 當輪出現三個「\`$greenweiVar.bindPattern.name$\`」有機率觸發或累積次數達時。
  - 機率 $greenweiVar.rate$%
  - 累積次數達 \`$greenweiVar.requiredBindPatternCount$\` 時自動觸發。

**回合數** 觸發時獲得基礎回合，期間可因條件增加回合。
  - 啟動獲得 +\`$greenweiVar.bonusTimes$\` 回合
  - 期間同時出現全「\`$greenweiVar.bindPattern.name$\`」再 +\`$greenweiVar.extendTimes$\`

**效果** 獲得分數提升 (乘以 \`$greenweiVar.mutiplier$\`)。

**結束** 綠光阿瑋次數歸零時自動退出模式。
`,
  },
  pikachu: {
    name: "皮卡丘充電",
    detail: `
**觸發時機** 遊玩次數用盡時出現任一「\`$pikachuVar.bindPattern.name$\`」。

**效果** 
  - 每次觸發 +\`$pikachuVar.bonusRounds$\` 次可玩次數。
  - 模式期間若出現任一「\`$pikachuVar.bindPattern.name$\`」，則額外增加 \`MIN(目前已觸發次數, $pikachuVar.bonusRounds$)\` 次可玩次數。

**結束** 當額外次數用盡且該輪未再出現 「\`$pikachuVar.bindPattern.name$\`」 時結束遊戲。
`,
  },
  superhhh: {
    name: "超級阿禾模式",
    detail: `
**觸發** 當輪出現任意「\`$superhhhVar.bindPattern.name$\`」且有機率觸發。
  - 機率 \`$superhhhVar.rate$\`%
  - 初次啟動獲得 \`$superhhhVar.bonusTimes$\` 回合。

**回合數** 觸發時獲得基礎回合，期間可因條件增加回合。
  - 若回合期間時三格皆為 「\`$superhhhVar.bindPattern.name$\`」，額外 +\`$superhhhVar.extendTimes$\` 回合。

**效果** 
  - 觸發當下三格皆為 「\`$superhhhVar.bindPattern.name$\`」 時，獲得額外加分 (當前總分的一半)。
  - 狀態期間的高分圖案機率大幅提升，低分圖案機率大幅下降。

**結束** 超級阿禾次數歸零後自動退出模式。
`,
  },
};
