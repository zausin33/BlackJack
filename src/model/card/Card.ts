import CardColor from "./CardColor";
import CardNumber from "./CardNumber";

class Card {
  public static VALUE_ROYAL_CARD = 10;

  public static VALUE_ACE_HIGH = 11;

  public static VALUE_ACE_LOW = 1;

  public readonly id: number;

  public readonly number: CardNumber;

  public readonly color: CardColor;

  public isConcealed = false;

  constructor(id: number, color: CardColor, number: CardNumber, isConcealed: boolean) {
    this.id = id;
    this.color = color;
    this.number = number;
    this.isConcealed = isConcealed;
  }

  public get imageName(): string {
    return this.isConcealed
      ? "concealed.png"
      : `${this.color.toString()}-${this.number.toString()}.png`;
  }
}

export default Card;
