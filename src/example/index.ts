import whois from "../index.ts";

const url = "google.com";

const result = await whois({ url });

console.log(result);
