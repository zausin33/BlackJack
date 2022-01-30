export const availableChips = [5, 10, 50, 100, 500, 1000, 5000];

const calculateChips = (money: number): { [index: number]: number} => {
  const chips: { [index: string]: number} = {};
  availableChips.forEach((chip) => {
    chips[chip.toString()] = 0;
  });
  let restMoney = money;
  availableChips.slice().reverse().forEach((chipValue) => {
    while (restMoney - chipValue >= 0) {
      chips[chipValue.toString()] += 1;
      restMoney -= chipValue;
    }
  });

  return chips;
};

export const chipsFolder = "assets/images/chips/";

export default calculateChips;
