import { resolve4, resolve6 } from "dns/promises";
import { logWarning } from "./log.ts";

type IpResult = (domain: string) => Promise<Array<string>>;

type IpAddresses = (domain: string) => Promise<{
  ipv4: Array<string>;
  ipv6: Array<string>;
}>;

const getIpv6: IpResult = async (domain) => {
  try {
    return await resolve6(domain);
  } catch (error) {
    logWarning("Unable to find IPv6 addresses for " + domain);
    return [];
  }
};

const getIpv4: IpResult = async (domain: string) => {
  try {
    return await resolve4(domain);
  } catch (error) {
    logWarning("Unable to find IPv4 addresses for " + domain);
    return [];
  }
};

export const getIpAddresses: IpAddresses = async (domain) => {
  const ipv4 = await getIpv4(domain);
  const ipv6 = await getIpv6(domain);
  return {
    ipv4,
    ipv6,
  };
};
