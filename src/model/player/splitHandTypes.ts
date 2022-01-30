import Card from "../card/Card";
import RoundStatus from "../RoundStatus";

export type Hand = {
    cards: Card[];
    bet: number;
}

export type FinishedHand = {
    cards: Card[];
    cardPoints: number;
    hastToMuchPoints: boolean;
    bet: number;
    moneyWonOrLost: number;
    status: RoundStatus.RUNNING | RoundStatus.WON | RoundStatus.LOST | RoundStatus.TIE
}
