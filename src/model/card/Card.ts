import CardColor from "./CardColor";
import CardNumber from "./CardNumber";

class Card {
  public static VALUE_ROYAL_CARD = 10;

  public static VALUE_ACE_HIGH = 11;

  public static VALUE_ACE_LOW = 1;

  private readonly id: number;

  private readonly color: CardColor;

  private readonly number: CardNumber;

  private concealed = false;

  constructor(id: number, color: CardColor, number: CardNumber, concealed: boolean) {
    this.id = id;
    this.color = color;
    this.number = number;
    this.concealed = concealed;
  }

  public getId(): number {
    return this.id;
  }

  public getColor(): CardColor {
    return this.color;
  }

  public getNumber(): CardNumber {
    return this.number;
  }

  public isConcealed(): boolean {
    return this.concealed;
  }

  public setConcealed(concealed: boolean): void {
    this.concealed = concealed;
  }

  public getImageName(): string {
    return this.isConcealed()
      ? "concealed.png"
      : `${this.color.toString()}-${this.number.toString()}.png`;
  }
}

export default Card;
