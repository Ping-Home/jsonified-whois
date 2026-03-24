import type { GetFallbackData } from "../types/index.js";

export const getFallbackData: GetFallbackData = (results) => {
  const reversedArr = [...results].reverse();
  let counter: number[] = [];

  for (let index in reversedArr) {
    counter[index] = 0;
      for (const key of Object.keys(reversedArr[index]) as Array<keyof typeof reversedArr[number]>) {
      if (reversedArr[index][key]) {
        continue;
      }
      counter[index]++;
    }
  }

  const minLossIndex = counter.indexOf(Math.min(...counter));
  return { ...reversedArr[minLossIndex] };
};
