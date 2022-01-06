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
      if (this.player.finishedSplitHands.length && !this.player.splitHands.length) {
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
  public readonly player: HumanPlayer;

  public readonly dealer:Dealer;

  public playerBet = 0;

  public roundBet = 50;

  private cardStack = new CardStack();

  private _moneyWonOrLost = 0;

  private _roundStatus = RoundStatus.RUNNING;

  private _canPlayerDoubleDown = false;

  private _canPlayerSplit = false;

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
    this.player.hand = [];
    this.player.splitHands = [];
    this.player.finishedSplitHands = [];
    this.dealer.hand = [];
    this.lineOutCards();
    this.playerBet = this.roundBet;
    this._moneyWonOrLost = 0;
    this._roundStatus = RoundStatus.RUNNING;
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
    newCard.isConcealed = isConcealed;
    player.addToHand(newCard);
  }

  private checkForStartOptions(): void {
    if (this.player.cardPoints === BLACKJACK_NUMBER) {
      this.endBlackjackRound();
    } else {
      this._canPlayerSplit = this.areFirstTwoPlayerCardsEqual();
      this._canPlayerDoubleDown = true;
    }
  }

  private areFirstTwoPlayerCardsEqual(): boolean {
    return this.player.hand[0].number === this.player.hand[1].number;
  }

  public startNewRoundOrSwitchActiveHand(): void {
    this._moneyWonOrLost = 0;
    if (this._roundStatus === RoundStatus.LOST_SPLIT_HAND) {
      this._roundStatus = RoundStatus.RUNNING;
    } else {
      this.player.increaseNumberPlayedGames();
      this.dealer.increaseNumberPlayedGames();
      this.startRound();
    }
  }

  public doubleDown(): void {
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.playerBet *= 2;
    this.takeCardHumanPlayer();
    if (this._roundStatus === RoundStatus.RUNNING) {
      if (this.player.splitHands.length) {
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
    return this.player.hand[0].number === CardNumber.ACE
        && this.player.hand[1].number === CardNumber.ACE;
  }

  public takeCardHumanPlayer(): void {
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.takeCard(this.player);
    const cardValues = this.player.cardPoints;
    if (cardValues > BLACKJACK_NUMBER) {
      if (this.player.splitHands.length || this.player.finishedSplitHands.length) {
        this.lostSplitHand();
      } else {
        this.endLostRound(RoundStatus.PLAYER_TO_MUCH_POINTS);
      }
    }
  }

  private lostSplitHand(): void {
    this._roundStatus = RoundStatus.LOST_SPLIT_HAND;
    if (this.player.splitHands.length || this.player.finishedSplitHands.filter((hand) => !hand.hastToMuchPoints).length) {
      this.stand();
    } else {
      this.endSplitRound();
    }
  }

  public stand(): void {
    if (this.player.splitHands.length) {
      this.takeNextSplitHand();
    } else {
      this.makeDealerMove();
    }
  }

  private takeNextSplitHand(): void {
    this.playerBet = this.player.switchActiveHand(this.playerBet, this._moneyWonOrLost);
    this._canPlayerDoubleDown = true;
    this.takeCardAfterSplit();
  }

  private takeCardAfterSplit(): void {
    this.takeCard(this.player);
    this._canPlayerSplit = this.areFirstTwoPlayerCardsEqual();
  }

  public makeDealerMove(): void {
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.dealer.hand[1].isConcealed = false;
    this.takeCardDealer();
  }

  public takeCardDealer(): void {
    const cardValues = this.dealer.cardPoints;
    if (cardValues <= THRESHOLD_DEALER_MUST_TAKE_CARD) {
      this.takeCard(this.dealer);
      this.takeCardDealer();
    } else {
      this.checkForWinner();
    }
  }

  private checkForWinner(): void {
    const cardValuesDealer = this.dealer.cardPoints;
    const cardValuesPlayer = this.player.cardPoints;
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
    this._moneyWonOrLost = -this.playerBet;
    this.setNewPlayerMoney();
    this._roundStatus = lostStatus;
  }

  @checkForSplitEnding()
  private endWonRound(): void {
    this._moneyWonOrLost = this.playerBet;
    this.setNewPlayerMoney();
    this._roundStatus = RoundStatus.WON;
  }

  @checkForSplitEnding()
  private endTieRound(tieStatus: RoundStatus.TIE | RoundStatus.BLACKJACK_TIE = RoundStatus.TIE): void {
    this._moneyWonOrLost = 0;
    this.setNewPlayerMoney();
    this._roundStatus = tieStatus;
  }

  private endBlackjackRound(): void {
    this.dealer.hand[1].isConcealed = false;

    if (this.hasDealerBlackjack()) {
      this.endTieRound(RoundStatus.BLACKJACK_TIE);
    } else {
      this._moneyWonOrLost = BLACKJACK_BET_MULTIPLIER * this.playerBet;
      this.setNewPlayerMoney();
      this._roundStatus = RoundStatus.BLACKJACK;
    }
  }

  public endSplitRound(): void {
    this.player.switchActiveHand(this.playerBet, this._moneyWonOrLost);
    this.player.finishedSplitHands.forEach((hand) => this.checkSplitHandForWinner(hand));
    this._moneyWonOrLost = this.player.finishedSplitHands.map((hand) => hand.moneyWonOrLost)
      .reduce((sum, accumulator) => (sum + accumulator), 0);
    this.setNewPlayerMoney();
    this._roundStatus = RoundStatus.END_SPLIT_ROUND;
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
        || (this.dealer.cardPoints <= BLACKJACK_NUMBER
            && this.dealer.cardPoints > hand.cardPoints);
  }

  private hasHandWon(hand: FinishedSplitHand): boolean {
    return this.dealer.cardPoints > BLACKJACK_NUMBER
        || (hand.cardPoints <= BLACKJACK_NUMBER && hand.cardPoints > this.dealer.cardPoints);
  }

  private hasDealerBlackjack(): boolean {
    return this.dealer.hand.length === 2 && this.dealer.cardPoints === BLACKJACK_NUMBER;
  }

  private setNewPlayerMoney(): void {
    this.player.money += this._moneyWonOrLost;
  }

  public get roundStatus(): RoundStatus {
    return this._roundStatus;
  }

  public get moneyLostOrWon(): number {
    return this._moneyWonOrLost;
  }

  public get canPlayerDoubleDown(): boolean {
    return this._canPlayerDoubleDown;
  }

  public get canPlayerSplit(): boolean {
    return this._canPlayerSplit;
  }
}

export default BlackjackGame;
