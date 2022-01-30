import React, { useEffect, useRef } from "react";
import CardModel from "../../model/card/Card";
import usePrevious from "../../utils/hooks/usePrevious";
import { setTranslateForAnimation, setTranslateForAnimationWithSrcPos } from "../../utils/domHelpers";

type CardProps = {
    card: CardModel;
    style?: object;
    isNotFromStack?: boolean;
}

export const imageFolder = "assets/images/cards/";

function Card({
  card, style = {}, isNotFromStack = false,
}: CardProps): JSX.Element {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const previousIsConcealed = usePrevious<boolean>(card.isConcealed);
  const { isConcealed } = card;

  useEffect(() => {
    if (isNotFromStack) {
      setTranslateForAnimationWithSrcPos(card.position, cardRef, card);
    } else if (card.wasInSplitHand) {
      setTranslateForAnimationWithSrcPos(card.position, cardRef, card);
      card.wasInSplitHand = false;
    } else {
      setTranslateForAnimation("first-stack-img", cardRef, card);
    }
  }, [card]);

  useEffect(() => {
    if (previousIsConcealed && !isConcealed && imgRef.current) {
      imgRef.current.className = "game-card-image-uncover-animation";
    }
  }, [isConcealed]);

  return (
    <div className="game-card" style={style} ref={cardRef}>
      <img
        src={imageFolder + card.imageName}
        alt="Card"
        ref={imgRef}
      />
    </div>
  );
}

export default Card;
