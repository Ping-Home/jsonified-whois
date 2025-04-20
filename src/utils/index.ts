import tldts from "tldts";
import type { NormalizeDate } from "../types/utils.ts";

export const normalizeDate = (date) => {
  if (!date) return null;
  const [year, month, day, hour, minute, second] = date.split(/\D/g);
  return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`;
};

export const verifyDomain: (domainInput: string) => void = (
  domainInput: string
) => {
  if (!domainInput.length) {
    throw new Error("Domain is required");
  }

  const domainWithoutSuffix: string | null =
    tldts.getDomainWithoutSuffix(domainInput);
  if (!domainWithoutSuffix) {
    throw new Error("Domain is not valid");
  }
};

export const parserInitialData = {
  createdAt: "",
  domainName: "",
  expiresAt: "",
  ip: "",
  nameServers: [],
  registrar: "",
  updateAt: "",
};

export const ianaWhoIsServer = "whois.iana.org";
