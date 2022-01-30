import CardStack from "./card/CardStack";
import HumanPlayer from "./player/HumanPlayer";
import Dealer from "./player/Dealer";
import Player from "./player/Player";
import {
  BLACKJACK_BET_MULTIPLIER,
  BLACKJACK_NUMBER,
  DELAY,
  THRESHOLD_DEALER_MUST_TAKE_CARD,
} from "./blackjackGameConstants";
import RoundStatus from "./RoundStatus";
import { FinishedHand } from "./player/splitHandTypes";
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

  public initialRoundBet = 0;

  public roundBet = 0;

  public isProcessing = false;

  private cardStack = new CardStack();

  private _moneyWonOrLost = 0;

  private _roundStatus = RoundStatus.STARTING;

  private _canPlayerDoubleDown = false;

  private _canPlayerSplit = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function,class-methods-use-this
  private updateUIFunction: () => void = () => {};

  constructor(player: HumanPlayer) {
    this.dealer = new Dealer();
    this.player = player;
    this.startGame();
  }

  public setUpdateUIFunction(updateUIFunction: () => void): void {
    this.updateUIFunction = updateUIFunction;
  }

  private updateUI(codeToExecute: () => void): void {
    this.updateUIFunction();
    setTimeout(() => {
      codeToExecute.call(this);
      this.updateUIFunction();
    }, DELAY);
  }

  public setProcessing(isProcessing: boolean): void {
    this.isProcessing = isProcessing;
    this.updateUIFunction();
  }

  private startGame(): void {
    this.cardStack.initialize();
    this.startRound();
  }

  public startRound(): void {
    this.player.startRound();
    this.dealer.startRound();
    this._roundStatus = RoundStatus.STARTING;
    this.roundBet = this.initialRoundBet;
  }

  public runRound(): void {
    this.initialRoundBet = this.roundBet;
    this.player.money -= this.roundBet;
    this.player.hand.bet = this.roundBet;
    this.lineOutCards();
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
      this.updateUI(this.endBlackjackRound);
    } else {
      this._canPlayerSplit = this.checkCanPlayerSplit();
      this._canPlayerDoubleDown = this.hasPlayerMoneyToDoubleBet();
    }
  }

  private checkCanPlayerSplit(): boolean {
    return this.areFirstTwoPlayerCardsEqual() && this.hasPlayerMoneyToDoubleBet();
  }

  private areFirstTwoPlayerCardsEqual(): boolean {
    return this.player.hand.cards[0].number === this.player.hand.cards[1].number;
  }

  public startNewRoundOrSwitchActiveHand(): void {
    this.setProcessing(false);
    if (this._roundStatus === RoundStatus.LOST_SPLIT_HAND) {
      this._roundStatus = RoundStatus.RUNNING;
    } else {
      this.player.increaseNumberPlayedGames();
      this.dealer.increaseNumberPlayedGames();
      this.startRound();
    }
  }

  public doubleDown(): void {
    this.setProcessing(true);
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.player.money -= this.player.hand.bet;
    this.roundBet += this.player.hand.bet;
    this.player.hand.bet *= 2;
    this.takeCardHumanPlayer(true);
    this.updateUI(() => {
      if (this._roundStatus === RoundStatus.RUNNING) {
        if (this.player.splitHands.length) {
          this.takeNextSplitHand();
        } else {
          this.makeDealerMove();
        }
      }
    });
  }

  public split(): void {
    const areBothPlayerCardsAces = this.areBothPlayerCardsAces();
    this.player.money -= this.player.hand.bet;
    this.roundBet += this.player.hand.bet;
    this.player.split();
    this.takeCardAfterSplit();
    if (areBothPlayerCardsAces) {
      this.setProcessing(true);
      this.updateUI(() => {
        this.stand();
        this.updateUI(() => {
          this.stand();
        });
      });
    }
  }

  private areBothPlayerCardsAces(): boolean {
    return this.player.hand.cards[0].number === CardNumber.ACE
        && this.player.hand.cards[1].number === CardNumber.ACE;
  }

  public takeCardHumanPlayer(playerHasDoubled = false): void {
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.takeCard(this.player);
    const cardValues = this.player.cardPoints;
    if (cardValues > BLACKJACK_NUMBER) {
      this.setProcessing(true);
      if (this.player.splitHands.length || this.player.finishedSplitHands.length) {
        this.lostSplitHand(playerHasDoubled);
      } else {
        this.endLostRound(RoundStatus.PLAYER_TO_MUCH_POINTS);
      }
    }
  }

  private lostSplitHand(playerHasDoubled = false): void {
    if (this.player.splitHands.length) {
      this.updateUI(() => {
        this.stand();
        this._roundStatus = RoundStatus.LOST_SPLIT_HAND;
      });
    } else if (this.player.finishedSplitHands.filter((hand) => !hand.hastToMuchPoints).length) {
      if (!playerHasDoubled) {
        this.updateUI(() => { this.stand(); });
      }
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
    this.setProcessing(false);
    this.player.switchActiveHand();
    this._canPlayerDoubleDown = this.hasPlayerMoneyToDoubleBet();
    this.takeCardAfterSplit();
  }

  private takeCardAfterSplit(): void {
    this.takeCard(this.player);
    this._canPlayerSplit = this.areFirstTwoPlayerCardsEqual();
  }

  public makeDealerMove(): void {
    this._canPlayerDoubleDown = false;
    this._canPlayerSplit = false;
    this.dealer.hand.cards[1].isConcealed = false;
    this.takeCardDealer();
  }

  public takeCardDealer(): void {
    this.setProcessing(true);
    const cardValues = this.dealer.cardPoints;
    if (cardValues <= THRESHOLD_DEALER_MUST_TAKE_CARD) {
      this.updateUI(() => {
        this.takeCard(this.dealer);
        this.takeCardDealer();
      });
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
    this._moneyWonOrLost = 0;
    this.setNewPlayerMoney();
    this._roundStatus = lostStatus;
  }

  @checkForSplitEnding()
  private endWonRound(): void {
    this._moneyWonOrLost = this.roundBet * 2;
    this.setNewPlayerMoney();
    this._roundStatus = RoundStatus.WON;
  }

  @checkForSplitEnding()
  private endTieRound(tieStatus: RoundStatus.TIE | RoundStatus.BLACKJACK_TIE = RoundStatus.TIE): void {
    this._moneyWonOrLost = this.roundBet;
    this.setNewPlayerMoney();
    this._roundStatus = tieStatus;
  }

  private endBlackjackRound(): void {
    this.dealer.hand.cards[1].isConcealed = false;

    if (this.hasDealerBlackjack()) {
      this.endTieRound(RoundStatus.BLACKJACK_TIE);
    } else {
      this._moneyWonOrLost = BLACKJACK_BET_MULTIPLIER * this.roundBet;
      this.setNewPlayerMoney();
      this._roundStatus = RoundStatus.BLACKJACK;
    }
  }

  public endSplitRound(): void {
    this.player.switchActiveHand();
    this.player.finishedSplitHands.forEach((hand) => this.checkSplitHandForWinner(hand));
    this._moneyWonOrLost = this.player.finishedSplitHands.map((hand) => hand.moneyWonOrLost)
      .reduce((sum, accumulator) => (sum + accumulator), 0);
    this.setNewPlayerMoney();
    this._roundStatus = RoundStatus.END_SPLIT_ROUND;
  }

  private checkSplitHandForWinner(hand: FinishedHand): void {
    if (this.hasHandLost(hand)) {
      hand.status = RoundStatus.LOST;
      hand.moneyWonOrLost = 0;
    } else if (this.hasHandWon(hand)) {
      hand.status = RoundStatus.WON;
      hand.moneyWonOrLost = hand.bet * 2;
    } else {
      hand.status = RoundStatus.TIE;
      hand.moneyWonOrLost = hand.bet;
    }
  }

  private hasHandLost(hand: FinishedHand): boolean {
    return hand.hastToMuchPoints
        || this.hasDealerBlackjack()
        || (this.dealer.cardPoints <= BLACKJACK_NUMBER
            && this.dealer.cardPoints > hand.cardPoints);
  }

  private hasHandWon(hand: FinishedHand): boolean {
    return this.dealer.cardPoints > BLACKJACK_NUMBER
        || (hand.cardPoints <= BLACKJACK_NUMBER && hand.cardPoints > this.dealer.cardPoints);
  }

  private hasDealerBlackjack(): boolean {
    return this.dealer.hand.cards.length === 2 && this.dealer.cardPoints === BLACKJACK_NUMBER;
  }

  private setNewPlayerMoney(): void {
    this.player.money += this._moneyWonOrLost;
  }

  private hasPlayerMoneyToDoubleBet(): boolean {
    return this.player.money >= this.player.hand.bet;
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
