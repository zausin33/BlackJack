import Player from "./Player";

class HumanPlayer extends Player {
  public static readonly START_MONEY = 2000;

  private numberPlayedGames = 0;

  private money = HumanPlayer.START_MONEY;

  private active = false;

  // eslint-disable-next-line no-useless-constructor
  public constructor(name: string) {
    super(name);
  }

  public static fromJson(data: Partial<HumanPlayer>): HumanPlayer {
    const player = new HumanPlayer("");
    Object.assign(player, data);
    return player;
  }

  public getNumberPlayedGames():number {
    return this.numberPlayedGames;
  }

  public increaseNumberPlayedGames():void {
    this.numberPlayedGames += 1;
  }

  public getMoney():number {
    return this.money;
  }

  public setMoney(money: number):void {
    this.money = money;
  }

  public isActive():boolean {
    return this.active;
  }

  public setActive(active: boolean):void {
    this.active = active;
  }
}

export default HumanPlayer;
