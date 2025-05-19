import tldts from "tldts";
import type { VerifyDomain } from "../types/index.js";

export const verifyDomain: VerifyDomain = (domain) => {
  if (!domain.length) {
    throw new Error("Domain input is required");
  }

  const domainWithoutSuffix: string | null =
    tldts.getDomainWithoutSuffix(domain);

  if (!domainWithoutSuffix) {
    throw new Error("Domain is not valid");
  }
};
