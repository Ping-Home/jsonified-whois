import WhoisClient from "../index.ts";
import type { WhoisClientConfig } from "../types/index.js";

const config: WhoisClientConfig = {
  url: "https://www.pinghome.io",
};

const whoisInstance = new WhoisClient(config);

await whoisInstance
  .fetchData()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
