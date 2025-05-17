import type { GetFallbackData } from "../types/index.js";

export const getFallbackData: GetFallbackData = (results) => {
  const reversedArr = [...results].reverse();
  let counter = [];

  for (let index in reversedArr) {
    counter[index] = 0;
    for (let key in reversedArr[index]) {
      if (reversedArr[index][key]) {
        continue;
      }
      counter[index]++;
    }
  }

  const minLossIndex = counter.indexOf(Math.min(...counter));
  return { ...reversedArr[minLossIndex] };
};
