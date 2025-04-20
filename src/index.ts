import tldts from "tldts";
import net from "net";
import { ianaParser, parsers } from "./parsers/index.ts";
import { ianaWhoIsServer, verifyDomain } from "./utils/index.ts";

const getWhoIsData = async (domain, suffix, whoIsServer) => {
  const promise = new Promise<string>((resolve, reject) => {
    let data = "";
    const socket = net.createConnection({ host: whoIsServer, port: 43 }, () =>
      socket.write(domain + "\r\n")
    );
    socket.setTimeout(60000);
    socket.on("data", (chunk) => (data += chunk));
    socket.on("close", () => resolve(data));
    socket.on("timeout", () => socket.destroy(new Error("Timeout")));
    socket.on("error", reject);
  });
  const response = await promise;
  console.log("adffds", whoIsServer === ianaWhoIsServer);
  const conversionResult =
    whoIsServer === ianaWhoIsServer
      ? ianaParser(response)
      : parsers(response, suffix);
  conversionResult["raw"] = response;
  return conversionResult;
};

const getAdditionalData = async (domain, suffix, whoIsServer, data) => {
  if (data.hasOwnProperty(whoIsServer)) {
    return data;
  }

  const response = await getWhoIsData(domain, suffix, whoIsServer);
  data[whoIsServer] = response;

  if (typeof response === "string") {
    return data;
  }

  if (response.registrar) {
    await getAdditionalData(domain, suffix, response.registrar, data);
  }
};

const whois = async ({ url }) => {
  try {
    verifyDomain(url);
    const hostName = tldts.getDomain(url);
    const suffix = tldts.getPublicSuffix(url);

    const whoIsServer = ianaWhoIsServer;
    const result = {};

    if (!whoIsServer) {
      throw new Error("No whois server found");
    }

    const response = await getWhoIsData(hostName, suffix, whoIsServer);

    result[whoIsServer] = response;

    if (response.registrar) {
      await getAdditionalData(hostName, suffix, response.registrar, result);
    }

    return result;
  } catch (error) {
    console.error(error);
  }
};

export default whois;
