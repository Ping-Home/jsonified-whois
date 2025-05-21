# jsonified-whois

A simple, open-source WHOIS client for Node.js that returns unified data as json.

## Features

- Query WHOIS information for domains
- Parses and normalizes WHOIS responses
- Supports falling back to query that has the most information
- Retrieves IPv4 and IPv6 addresses for domains
- TypeScript support

## Installation

```sh
npm install jsonified-whois
```

or

```sh
yarn add jsonified-whois
```

## Usage

```ts
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
```

See [src/example/index.ts](src/example/index.ts) for a usage example.

## API

### `WhoisClient(options)`

- `url` (string): Domain or URL to query (required)
- `fallback` (boolean): Enable fallback data extraction (optional)
- `port` (number): WHOIS server port (default: 43)
- `whoisServer` (string): WHOIS server to start the query from (optional)

#### Methods

- `fetchData()`: Returns a Promise resolving to WHOIS data.

#### Response Example

```json
{
  "createdAt": "2022-02-04T09:28:59.20Z",
  "domainName": "pinghome.io",
  "expiresAt": "2026-02-04T09:28:59.20Z",
  "ipAddresses": {
    "ipv4": ["18.244.87.32", "18.244.87.23", "18.244.87.115", "18.244.87.71"],
    "ipv6": []
  },
  "nameServers": [
    "ns-183.awsdns-22.com",
    "ns-957.awsdns-55.net",
    "ns-1524.awsdns-62.org",
    "ns-1601.awsdns-08.co.uk"
  ],
  "registrar": "whois.namecheap.com",
  "updateAt": "2024-01-15T17:49:12.10Z",
  "queriedWhoisServer": "whois.namecheap.com",
  "queryData": [
    {
      "createdAt": "1997-09-16",
      "domainName": "pinghome.io",
      "expiresAt": "",
      "ipAddresses": {
        "ipv4": [
          "18.244.87.32",
          "18.244.87.23",
          "18.244.87.115",
          "18.244.87.71"
        ],
        "ipv6": []
      },
      "nameServers": [
        "A0.NIC.IO 2a01:8840:9e:0:0:0:0:17 65.22.160.17",
        "A2.NIC.IO 2a01:8840:a1:0:0:0:0:17 65.22.163.17",
        "B0.NIC.IO 2a01:8840:9f:0:0:0:0:17 65.22.161.17",
        "C0.NIC.IO 2a01:8840:a0:0:0:0:0:17 65.22.162.17"
      ],
      "registrar": "whois.nic.io",
      "updateAt": "2023-01-18",
      "queriedWhoisServer": "whois.iana.org",
      "raw": "..."
    },
    {
      "createdAt": "2022-02-04T09:28:59Z",
      "domainName": "pinghome.io",
      "expiresAt": "2026-02-04T09:28:59Z",
      "ipAddresses": {
        "ipv4": [
          "18.244.87.32",
          "18.244.87.23",
          "18.244.87.115",
          "18.244.87.71"
        ],
        "ipv6": []
      },
      "nameServers": [
        "ns-957.awsdns-55.net",
        "ns-1601.awsdns-08.co.uk",
        "ns-1524.awsdns-62.org",
        "ns-183.awsdns-22.com"
      ],
      "registrar": "whois.namecheap.com",
      "updateAt": "2024-01-20T17:49:55Z",
      "queriedWhoisServer": "whois.nic.io",
      "raw": "..."
    },
    {
      "createdAt": "2022-02-04T09:28:59.20Z",
      "domainName": "pinghome.io",
      "expiresAt": "2026-02-04T09:28:59.20Z",
      "ipAddresses": {
        "ipv4": [
          "18.244.87.32",
          "18.244.87.23",
          "18.244.87.115",
          "18.244.87.71"
        ],
        "ipv6": []
      },
      "nameServers": [
        "ns-183.awsdns-22.com",
        "ns-957.awsdns-55.net",
        "ns-1524.awsdns-62.org",
        "ns-1601.awsdns-08.co.uk"
      ],
      "registrar": "whois.namecheap.com",
      "updateAt": "2024-01-15T17:49:12.10Z",
      "queriedWhoisServer": "whois.namecheap.com",
      "raw": "..."
    }
  ]
}
```

## License

MIT © 2025 Pinghome
