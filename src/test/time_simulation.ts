import { ONE_DAY } from "../constants.ts";

export const timeSimulation = () => {
  let currentTime = 0;
  const passDay = () => {
    currentTime += ONE_DAY;
  };
  const getNow = () => currentTime;
  const reset = () => {
    currentTime = 0;
  };

  return {
    passDay,
    getNow,
    reset,
  };
};
