import Player from "./player";

export type Settings = {
  useBasicStrategy: boolean;
  useCardCounter: boolean;
}

class HumanPlayer extends Player {
  public static readonly START_MONEY = 2000;

  public money = HumanPlayer.START_MONEY;

  public isActive = false;

  public settings: Settings = {
    useBasicStrategy: true,
    useCardCounter: true,
  };

  // eslint-disable-next-line no-useless-constructor
  public constructor(name: string) {
    super(name);
  }

  public static fromJson(data: Partial<HumanPlayer>): HumanPlayer {
    const player = new HumanPlayer("");
    Object.assign(player, data);
    return player;
  }
}

export default HumanPlayer;
