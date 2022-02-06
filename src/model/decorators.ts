import BlackjackGame from "./blackjackGame";

// eslint-disable-next-line import/prefer-default-export
export const checkForSplitEnding = () => (
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
