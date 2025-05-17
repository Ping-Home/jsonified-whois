import type { Normalizer } from "../types/index.js";

export const normalizer: Normalizer = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .trim();
};
