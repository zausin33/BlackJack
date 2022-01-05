import React, { useEffect, useRef } from "react";
import CardModel from "../../model/card/Card";

type CardProps = {
    card: CardModel;
    style?: object;
}

export const imageFolder = "assets/images/cards/";

function Card({ card, style = {} }: CardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    func();
  }, []);

  function evalRect(rect: DOMRect): { centerX: number, centerY: number } {
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.5;
    return { centerX, centerY };
  }

  function func(): void {
    const cardStack = document.getElementById("first-stack-img");
    if (!cardRef.current || !cardStack) return;
    const target = cardRef.current;
    const rectCardStack = cardStack.getBoundingClientRect();
    const rectTarget = target.getBoundingClientRect();
    const cardStackCenter = evalRect(rectCardStack);
    const targetCenter = evalRect(rectTarget);

    const translateX = cardStackCenter.centerX - targetCenter.centerX;
    const translateY = cardStackCenter.centerY - targetCenter.centerY;

    target.style.transform = `translate(${translateX}px, ${translateY}px) `;
  }

  return (
    <div className="game-card" style={style} ref={cardRef}>
      <img
        src={imageFolder + card.getImageName()}
        alt="Card"
      />
    </div>
  );
}

export default Card;
