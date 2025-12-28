import { LaBaG } from "labag";
import { game } from "./game";

type RoundRecord = {
  roundNumber: number;
  randNums: Record<string, number>;
};

class Recorder {
  private game: LaBaG;
  private rounds: RoundRecord[] = [];
  private onRoundEndBound: (e: LaBaG) => void;
  private started = false;

  constructor(gameInstance: LaBaG) {
    this.game = gameInstance;
    this.onRoundEndBound = this.onRoundEnd.bind(this);
  }

  private onRoundEnd(g: LaBaG) {
    const record: RoundRecord = {
      roundNumber: g.rounds,
      randNums: {},
    };

    Object.entries(g.randNums).forEach(([k, v]) => {
      record.randNums[k] = v;
    });

    (g.modes || []).forEach((mode) => {
      if (!mode?.variable?.randNum && isNaN(mode.variable.randNum)) return;
      record.randNums[mode.name] = mode.variable.randNum;
    });
    console.log(record);
    this.rounds.push(record);
  }

  init() {
    if (this.started) return;
    this.rounds = [];
    this.game.addEventListener("roundEnd", this.onRoundEndBound);
    this.started = true;
  }

  // 如果底層 event 支援移除 listener，呼叫之
  dispose() {
    if (!this.started) return;
    this.game.removeEventListener("roundEnd", this.onRoundEndBound);
    this.started = false;
  }

  // 取得複本，不讓外部直接修改內部陣列
  getRecords(): RoundRecord[] {
    return this.rounds.map((r) => ({ ...r, randNums: { ...r.randNums } }));
  }

  clear() {
    this.rounds = [];
  }
}

export const recorder = new Recorder(game);
