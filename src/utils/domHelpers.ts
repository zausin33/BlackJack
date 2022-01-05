import React from "react";

const evalRect = (rect: DOMRect): { centerX: number, centerY: number } => {
  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.5;
  return { centerX, centerY };
};

const setTranslateForAnimation = (sourceId: string, targetRef: React.RefObject<HTMLElement>): void => {
  const cardStack = document.getElementById(sourceId);
  if (!targetRef.current || !cardStack) return;
  const target = targetRef.current;
  const rectCardStack = cardStack.getBoundingClientRect();
  const rectTarget = target.getBoundingClientRect();
  const cardStackCenter = evalRect(rectCardStack);
  const targetCenter = evalRect(rectTarget);

  const translateX = cardStackCenter.centerX - targetCenter.centerX;
  const translateY = cardStackCenter.centerY - targetCenter.centerY;

  target.style.transform = `translate(${translateX}px, ${translateY}px) `;
};

export default setTranslateForAnimation;
