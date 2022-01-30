import React from "react";
import Card from "../model/card/Card";

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
