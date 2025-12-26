import { LaBaG, modeList } from "labag";

const game = new LaBaG(30);
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

export { game };
