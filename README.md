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

## License

MIT © 2025 Pinghome
