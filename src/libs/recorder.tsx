import { LaBaG } from "labag";
import { game } from "./game";

type RoundRecord = {
  randNums: Record<string, number>;
};

type RecorderOptions = {
  debug?: boolean; // 若為 true，會以 console.debug 輸出紀錄
};
class Recorder {
  private game: LaBaG;
  private rounds: RoundRecord[] = [];
  private onRoundEndBound: (e: LaBaG) => void;
  private started = false;
  private debug = false;

  constructor(gameInstance: LaBaG, options?: RecorderOptions) {
    this.game = gameInstance;
    this.onRoundEndBound = this.onRoundEnd.bind(this);
    this.debug = !!options?.debug;
  }

  private onRoundEnd(g: LaBaG) {
    const randNums: Record<string, number> = {};

    g.randNums.forEach((value, key) => {
      if (!isNaN(value)) {
        randNums[key] = value;
      }
    });

    // 收集各模式的 randNum（若為數值且有效）
    g.modes.forEach((mode) => {
      const rn = mode?.variable?.randNum;
      if (!isNaN(rn)) {
        randNums[mode.name] = rn;
      }
    });

    const record: RoundRecord = {
      randNums,
    };

    if (this.debug) console.debug("recorder:onRoundEnd", record);

    this.rounds.push(record);
  }

  init(clearExisting = true) {
    if (this.started) return;
    if (clearExisting) this.rounds = [];
    if (typeof this.game.addEventListener === "function") {
      this.game.addEventListener("roundEnd", this.onRoundEndBound);
      this.started = true;
    }
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

export const recorder = new Recorder(game, { debug: false });
