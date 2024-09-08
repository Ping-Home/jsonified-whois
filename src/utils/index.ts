import tldts from 'tldts';
import { NormalizeDate } from "../types/utils.js"
import { readFile } from 'fs/promises'

export const normalizeDate = (date ) => { 
  if(!date) return null   
  const [year,month,day,hour,minute,second] = date.split(/\D/g)
  return `${year}-${month}-${day} ${hour}:${minute}:${second} UTC`
}

export const verifyDomain: (domainInput: string) => void = (domainInput: string) => {
  if (!domainInput.length) {
    throw new Error('Domain is required');
  }

  const domainWithoutSuffix: string | null = tldts.getDomainWithoutSuffix(domainInput)
  if (!domainWithoutSuffix) {
    throw new Error('Domain is not valid');
  }
}

export const getServerLists = async () => {
  try {
    const data = await readFile('../../src/servers.json');
    const jsonData = data.toString();
    const servers = JSON.parse(jsonData);

    return servers;
  }
  catch (error) {
    console.error(error);
  }
}