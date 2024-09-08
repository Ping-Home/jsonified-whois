import tldts from 'tldts';
import net from 'net';
import { parsers } from './parsers/index.js'
import { defaultFormatter } from './formatters/default.js';
import { getServerLists, verifyDomain } from './utils/index.js';

const getWhoIsData = async (domain, suffix, whoIsServer) => {
  const promise = new Promise<string>((resolve, reject) => {
    let data = ''
    const socket = net.createConnection({ host: whoIsServer, port: 43 }, () => socket.write(domain + '\r\n'))
    socket.setTimeout(60000)
    socket.on('data', (chunk) => (data += chunk))
    socket.on('close', () => resolve(data))
    socket.on('timeout', () => socket.destroy(new Error('Timeout')))
    socket.on('error', reject)
  })
  const response = await promise;
  const conversionResult = parsers(response, suffix);
  conversionResult['raw_text'] = response;

  if (conversionResult) {
    return conversionResult;

  }
  return {};
}

const getAdditionalData = async (data, domain, suffix, whoIsServer) => {
  if (data.hasOwnProperty(whoIsServer)) {
    return data;
  }
  const response = await getWhoIsData(domain, suffix, whoIsServer);

  data[whoIsServer] = response;

  if (typeof response === 'string') {
    return data;
  }

  if (response.registrar_whois_server) {
    await getAdditionalData(data, domain, suffix, response.registrar_whois_server)
  }
}

const whois = async ({ url }) => {
  try {
    verifyDomain(url);
    const hostName = tldts.getDomain(url);
    const suffix = tldts.getPublicSuffix(url);
    const servers = await getServerLists();
    const whoIsServer = servers[suffix] || 'whois.iana.org';
    const data = {};
    const result = {}

    if (!whoIsServer) {
      throw new Error('No whois server found');
    }

    const response = await getWhoIsData(hostName, suffix, whoIsServer);
    data[whoIsServer] = response;
    
    for (const key in data) { 
      result[key] = defaultFormatter(data[key], suffix);
    }

    if (response.registrar_whois_server) {
      await getAdditionalData(data, hostName, suffix, response.registrar_whois_server)
    }

    return result;
  }
  catch (error) {
    console.error(error);
  }
}

export default whois