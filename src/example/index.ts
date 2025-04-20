import whois from "../index.ts";

// const urls = [
//   "pinghome.az",
//   "pinghome.io",
//   "google.com",
//   "google.az",
//   "amazon.com",
//   "ebay.com",
//   "microsoft.com",
//   "apple.com",
//   "tesla.com",
//   "spacex.com",
//   "nasa.gov",
//   "facebook.com",
//   "medappoint.app",
//   "domen.az",
// ];

const urls = ["google.com"];

for (const url of urls) {
  const result = await whois({ url });
  console.log(url, result);
}
