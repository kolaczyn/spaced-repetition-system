const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export const getNextFib = (num: number): number =>
  Math.round(GOLDEN_RATIO * num);
