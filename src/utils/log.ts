import { errorColor, warnColor } from "../constants.ts";
import type { Log } from "../types/index.js";

export const logWarning: Log = (message) => {
  console.warn(warnColor, message);
};

export const logError: Log = (message) => {
  console.error(errorColor, message);
};
