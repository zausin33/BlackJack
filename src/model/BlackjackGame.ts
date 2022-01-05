import CardStack from "./card/CardStack";
import HumanPlayer from "./player/HumanPlayer";
import Dealer from "./player/Dealer";
import Player from "./player/Player";
import { BLACKJACK_BET_MULTIPLIER, BLACKJACK_NUMBER, THRESHOLD_DEALER_MUST_TAKE_CARD } from "./blackjackGameConstants";
import RoundStatus from "./RoundStatus";
import { FinishedSplitHand } from "./player/splitHandTypes";
import CardNumber from "./card/CardNumber";

const checkForSplitEnding = () => (
  // eslint-disable-next-line no-use-before-define
  target: BlackjackGame,
  memberName: string,
  propertyDescriptor: PropertyDescriptor,
) => ({
  get() {
    const wrapperFn = (...args: any[]): void => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (this.player.getFinishedSplitHands().length && !this.player.getSplitHands().length) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.endSplitRound();
      } else {
        propertyDescriptor.value.apply(this, args);
      }
    };

    Object.defineProperty(this, memberName, {
      value: wrapperFn,
      configurable: true,
      writable: true,
    });
    return wrapperFn;
  },
});

class BlackjackGame {
  private cardStack = new CardStack();

  private playerBet = 0;

  private roundBet = 50;

  private moneyWonOrLost = 0;

  private roundStatus = RoundStatus.RUNNING;

  private canPlayerDoubleDown = false;

  private canPlayerSplit = false;

  private readonly player: HumanPlayer;

  private readonly dealer:Dealer;

  constructor(player: HumanPlayer) {
    this.dealer = new Dealer();
    this.player = player;
    this.startGame();
  }

  private startGame(): void {
    this.cardStack.initialize();
    this.startRound();
  }

  public startRound(): void {
    this.player.setHand([]);
    this.player.setSplitHands([]);
    this.player.setFinishedSplitHands([]);
    this.dealer.setHand([]);
    this.lineOutCards();
    this.playerBet = this.roundBet;
    this.moneyWonOrLost = 0;
    this.roundStatus = RoundStatus.RUNNING;
    this.checkForStartOptions();
  }

  private lineOutCards(): void {
    this.takeCard(this.player);
    this.takeCard(this.dealer);
    this.takeCard(this.player);
    this.takeCard(this.dealer, true);
  }

  private takeCard(player: Player, isConcealed = false): void {
    const newCard = this.cardStack.shift();
    newCard.setConcealed(isConcealed);
    player.addToHand(newCard);
  }

  private checkForStartOptions(): void {
    if (this.player.getCardPoints() === BLACKJACK_NUMBER) {
      this.endBlackjackRound();
    } else {
      this.canPlayerSplit = this.areFirstTwoPlayerCardsEqual();
      this.canPlayerDoubleDown = true;
    }
  }

  private areFirstTwoPlayerCardsEqual(): boolean {
    return this.player.getHand()[0].getNumber() === this.player.getHand()[1].getNumber();
  }

  public startNewRoundOrSwitchActiveHand(): void {
    this.moneyWonOrLost = 0;
    if (this.roundStatus === RoundStatus.LOST_SPLIT_HAND) {
      this.roundStatus = RoundStatus.RUNNING;
    } else {
      this.player.increaseNumberPlayedGames();
      this.dealer.increaseNumberPlayedGames();
      this.startRound();
    }
  }

  public doubleDown(): void {
    this.canPlayerDoubleDown = false;
    this.canPlayerSplit = false;
    this.playerBet *= 2;
    this.takeCardHumanPlayer();
    if (this.roundStatus === RoundStatus.RUNNING) {
      if (this.player.getSplitHands().length) {
        this.takeNextSplitHand();
      } else this.makeDealerMove();
    }
  }

  public split(): void {
    const areBothPlayerCardsAces = this.areBothPlayerCardsAces();
    this.player.split(this.playerBet);
    this.takeCardAfterSplit();
    if (areBothPlayerCardsAces) {
      this.stand();
      this.stand();
    }
  }

  private areBothPlayerCardsAces(): boolean {
    return this.player.getHand()[0].getNumber() === CardNumber.ACE
        && this.player.getHand()[1].getNumber() === CardNumber.ACE;
  }

  public takeCardHumanPlayer(): void {
    this.canPlayerDoubleDown = false;
    this.canPlayerSplit = false;
    this.takeCard(this.player);
    const cardValues = this.player.getCardPoints();
    if (cardValues > BLACKJACK_NUMBER) {
      if (this.player.getSplitHands().length || this.player.getFinishedSplitHands().length) {
        this.lostSplitHand();
      } else {
        this.endLostRound(RoundStatus.PLAYER_TO_MUCH_POINTS);
      }
    }
  }

  private lostSplitHand(): void {
    this.roundStatus = RoundStatus.LOST_SPLIT_HAND;
    if (this.player.getSplitHands().length || this.player.getFinishedSplitHands().filter((hand) => !hand.hastToMuchPoints).length) {
      this.stand();
    } else {
      this.endSplitRound();
    }
  }

  public stand(): void {
    if (this.player.getSplitHands().length) {
      this.takeNextSplitHand();
    } else {
      this.makeDealerMove();
    }
  }

  private takeNextSplitHand(): void {
    this.playerBet = this.player.switchActiveHand(this.playerBet, this.moneyWonOrLost);
    this.canPlayerDoubleDown = true;
    this.takeCardAfterSplit();
  }

  private takeCardAfterSplit(): void {
    this.takeCard(this.player);
    this.canPlayerSplit = this.areFirstTwoPlayerCardsEqual();
  }

  public makeDealerMove(): void {
    this.canPlayerDoubleDown = false;
    this.canPlayerSplit = false;
    this.dealer.getHand()[1].setConcealed(false);
    this.takeCardDealer();
  }

  public takeCardDealer(): void {
    const cardValues = this.dealer.getCardPoints();
    if (cardValues <= THRESHOLD_DEALER_MUST_TAKE_CARD) {
      this.takeCard(this.dealer);
      this.takeCardDealer();
    } else {
      this.checkForWinner();
    }
  }

  private checkForWinner(): void {
    const cardValuesDealer = this.dealer.getCardPoints();
    const cardValuesPlayer = this.player.getCardPoints();
    if (cardValuesDealer > BLACKJACK_NUMBER) {
      this.endWonRound();
    } else if (this.hasDealerBlackjack()) {
      this.endLostRound(RoundStatus.LOST);
    } else if (cardValuesDealer > cardValuesPlayer) {
      this.endLostRound(RoundStatus.LOST);
    } else if (cardValuesDealer < cardValuesPlayer) {
      this.endWonRound();
    } else {
      this.endTieRound();
    }
  }

  @checkForSplitEnding()
  private endLostRound(lostStatus: RoundStatus.PLAYER_TO_MUCH_POINTS | RoundStatus.LOST): void {
    this.moneyWonOrLost = -this.playerBet;
    this.setNewPlayerMoney();
    this.roundStatus = lostStatus;
  }

  @checkForSplitEnding()
  private endWonRound(): void {
    this.moneyWonOrLost = this.playerBet;
    this.setNewPlayerMoney();
    this.roundStatus = RoundStatus.WON;
  }

  @checkForSplitEnding()
  private endTieRound(tieStatus: RoundStatus.TIE | RoundStatus.BLACKJACK_TIE = RoundStatus.TIE): void {
    this.moneyWonOrLost = 0;
    this.setNewPlayerMoney();
    this.roundStatus = tieStatus;
  }

  private endBlackjackRound(): void {
    this.dealer.getHand()[1].setConcealed(false);

    if (this.hasDealerBlackjack()) {
      this.endTieRound(RoundStatus.BLACKJACK_TIE);
    } else {
      this.moneyWonOrLost = BLACKJACK_BET_MULTIPLIER * this.playerBet;
      this.setNewPlayerMoney();
      this.roundStatus = RoundStatus.BLACKJACK;
    }
  }

  public endSplitRound(): void {
    this.player.switchActiveHand(this.playerBet, this.moneyWonOrLost);
    this.player.getFinishedSplitHands().forEach((hand) => this.checkSplitHandForWinner(hand));
    this.moneyWonOrLost = this.player.getFinishedSplitHands().map((hand) => hand.moneyWonOrLost)
      .reduce((sum, accumulator) => (sum + accumulator), 0);
    this.setNewPlayerMoney();
    this.roundStatus = RoundStatus.END_SPLIT_ROUND;
  }

  private checkSplitHandForWinner(hand: FinishedSplitHand): void {
    if (this.hasHandLost(hand)) {
      hand.status = RoundStatus.LOST;
      hand.moneyWonOrLost = -hand.bet;
    } else if (this.hasHandWon(hand)) {
      hand.status = RoundStatus.WON;
      hand.moneyWonOrLost = hand.bet;
    } else {
      hand.status = RoundStatus.TIE;
      hand.moneyWonOrLost = 0;
    }
  }

  private hasHandLost(hand: FinishedSplitHand): boolean {
    return hand.hastToMuchPoints
        || this.hasDealerBlackjack()
        || (this.dealer.getCardPoints() <= BLACKJACK_NUMBER
            && this.dealer.getCardPoints() > hand.cardPoints);
  }

  private hasHandWon(hand: FinishedSplitHand): boolean {
    return this.dealer.getCardPoints() > BLACKJACK_NUMBER
        || (hand.cardPoints <= BLACKJACK_NUMBER && hand.cardPoints > this.dealer.getCardPoints());
  }

  private hasDealerBlackjack(): boolean {
    return this.dealer.getHand().length === 2 && this.dealer.getCardPoints() === BLACKJACK_NUMBER;
  }

  private setNewPlayerMoney(): void {
    this.player.setMoney(this.player.getMoney() + this.moneyWonOrLost);
  }

  public getHumanPlayer(): HumanPlayer {
    return this.player;
  }

  public getDealer(): Dealer {
    return this.dealer;
  }

  public getRoundBet(): number {
    return this.roundBet;
  }

  public setRoundBet(roundBet: number): void {
    this.roundBet = roundBet;
  }

  public getPlayerBet(): number {
    return this.playerBet;
  }

  public getRoundStatus(): RoundStatus {
    return this.roundStatus;
  }

  public getMoneyLostOrWon(): number {
    return this.moneyWonOrLost;
  }

  public getCanPlayerDoubleDown(): boolean {
    return this.canPlayerDoubleDown;
  }

  public getCanPlayerSplit(): boolean {
    return this.canPlayerSplit;
  }
}

export default BlackjackGame;
