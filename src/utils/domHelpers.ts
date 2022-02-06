import React from "react";
import Card from "../model/card/card";

export type Position = {
  centerX: number;
  centerY: number;
} | undefined

const evalRect = (rect: DOMRect): { centerX: number, centerY: number } => {
  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.5;
  return { centerX, centerY };
};

export const setTranslateForAnimation = (
  sourceId: string,
  targetRef: React.RefObject<HTMLElement>,
  card: Card,
): void => {
  const sourceElement = document.getElementById(sourceId);
  if (!targetRef.current || !sourceElement) return;
  const target = targetRef.current;
  const rectSourceElement = sourceElement.getBoundingClientRect();
  const rectTarget = target.getBoundingClientRect();
  const sourceElementCenter = evalRect(rectSourceElement);
  const targetCenter = evalRect(rectTarget);
  card.position = { centerX: targetCenter.centerX, centerY: targetCenter.centerY };

  const translateX = sourceElementCenter.centerX - targetCenter.centerX;
  const translateY = sourceElementCenter.centerY - targetCenter.centerY;

  target.style.transform = `translate(${translateX}px, ${translateY}px) `;
};

export const setTranslateForAnimationWithSrcPos = (
  sourcePosition: Position,
  targetRef: React.RefObject<HTMLElement>,
  card: Card,
): void => {
  if (!targetRef.current || !sourcePosition) return;
  const target = targetRef.current;
  const rectTarget = target.getBoundingClientRect();
  const targetCenter = evalRect(rectTarget);
  card.position = { centerX: targetCenter.centerX, centerY: targetCenter.centerY };

  const translateX = sourcePosition.centerX - targetCenter.centerX;
  const translateY = sourcePosition.centerY - targetCenter.centerY;

  target.style.transform = `translate(${translateX}px, ${translateY}px) `;
};

export const placeElementsInCircle = (circleSelector: string, elementSelector: string): void => {
  document.querySelectorAll(circleSelector).forEach((circleGraph) => {
    const circles: NodeListOf<HTMLElement> = circleGraph.querySelectorAll(elementSelector);
    let angle = 360 - 90; const
      dangle = 360 / circles.length;
    for (let i = 0; i < circles.length; i += 1) {
      const circle = circles[i];
      angle += dangle;
      circle.style.transform = `rotate(${angle}deg) translate(${circleGraph.clientWidth / 2}px) rotate(-${angle}deg)`;
    }
  });
};
