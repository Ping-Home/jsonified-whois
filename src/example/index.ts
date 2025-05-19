import WhoisClient from "../index.ts";

const whoisInstance = new WhoisClient({ url: "https://www.pinghome.io" });
await whoisInstance
  .fetchData()
  .then((res) => console.log(res))
  .catch((error) => console.log(error));
