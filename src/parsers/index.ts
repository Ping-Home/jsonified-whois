import { Parsers } from "../types/parsers.js"
import { defaultParser } from "./default.js"
import { dkParser } from "./dk.js"
import { nlParser } from "./nl.js"

export const parsers:Parsers= (data: string, suffix: string) => {
    const splitter = data.endsWith('\r\n') ? '\r\n' : '\n'
    switch (suffix) {
        case "com":
        case "org":
        case "net":
        case "io":
        case "in":
        case "xyz":
        case "co":
        case "app":
        case "cloud":
            return defaultParser(data, splitter)
        case "nl":
            return nlParser(data, splitter)
        case "de":
            return { data }
        case "dk":
            return dkParser(data, splitter)
        case "co.uk":
            return { data }
        case "it":
            return { data }
        case "ro":
            return { data }
        case "ai":
            return { data }
        case "se":
            return { data }
        case "eu":
            return { data }
        case "ca":
            return { data }
        case "es":
            return { data }
        case "fr":
            return { data }
        case "ee":
            return { data }
        case "pl":
            return { data }
        case "com.au":
            return { data }
        case "az":
            return { data }
        case "sk":
            return { data }
        case "pro":
            return { data }
        case "dev":
            return { data }
        case "is":
            return { data }
        case "site":
            return { data }
        case "jobs":
            return { data }
        case "lv":
            return { data }
        case "lt":
            return { data }
        case "vn":
            return { data }
        case "be":
            return { data }
        case "me":
            return { data }
        case "cz":
            return { data }
        case "myqnapcloud.com":
            return { data }
        case "pt":
            return { data }
        case "ae":
            return { data }
        case "hu":
            return { data }
        case "repl.co":
            return { data }
        case "tech":
            return { data }
        case "live":
            return { data }
        case "workers.dev":
            return { data }
        case "hr":
            return { data }
        case "bg":
            return { data }
        case "org.au":
            return { data }
        case "biz":
            return { data }
        case "gr":
            return { data }
        case "fit":
            return { data }
        case "co.in":
            return { data }
        case "hopto.org":
            return { data }
        case "win":
            return { data }
        case "store":
            return { data }
        case "ua":
            return { data }
        case "ir":
            return { data }
        case "com.ua":
            return { data }
        case "ch":
            return { data }
        case "herokuapp.com":
            return { data }
        case "pk":
            return { data }
        case "at":
            return { data }
        case "com.de":
            return { data }
        case "azurewebsites.net":
            return { data }
        case "guide":
            return { data }
        case "uk":
            return { data }
        case "ooo":
            return { data }
        case "rs":
            return { data }
        case "us":
            return { data }
        case "com.hk":
            return { data }
        case "ddns.net":
            return { data }
        case "tv":
            return { data }
        case "link":
            return { data }
        case "asia":
            return { data }
        case "ci":
            return { data }
        case "org.uk":
            return { data }
        case "co.za":
            return { data }
        case "shop":
            return { data }
        case "com.tr":
            return { data }
        case "one":
            return { data }
        case "page":
            return { data }
        case "partners":
            return { data }
        case "edu":
            return { data }
        case "digital":
            return { data }
        case "ru":
            return { data }
        case "edu.au":
            return { data }
        case "tk":
            return { data }
        case "al":
            return { data }
        case "academy":
            return { data }
        case "studio":
            return { data }
        case "sardegna.it":
            return { data }
        case "info":
            return { data }
        case "services":
            return { data }
        case "org.hk":
            return { data }
        case "edu.az":
            return { data }
        case "expert":
            return { data }
        case "travel":
            return { data }
        case "pp.ua":
            return { data }
        case "amsterdam":
            return { data }
        case "network":
            return { data }
        case "id":
            return { data }
        case "cc":
            return { data }
        case "si":
            return { data }
        case "media":
            return { data }
        case "onrender.com":
            return { data }
        case "edu.pl":
            return { data }
        case "duckdns.org":
            return { data }
        case "no-ip.org":
            return { data }
        case "com.ar":
            return { data }
        case "cl":
            return { data }
        case "com.vn":
            return { data }
        case "service.gov.uk":
            return { data }
        case "legal":
            return { data }
        case "co.th":
            return { data }
        case "eco":
            return { data }
        case "to":
            return { data }
        case "club":
            return { data }
        case "myfritz.net":
            return { data }
        case "au":
            return { data }
        case "su":
            return { data }
        case "github.io":
            return { data }
        case "gov.hk":
            return { data }
        case "technology":
            return { data }
        case "cloudapp.net":
            return { data }
        case "ba":
            return { data }
        case "altervista.org":
            return { data }
        case "icu":
            return { data }
        case "mk":
            return { data }
        case "lk":
            return { data }
        case "events":
            return { data }
        case "cards":
            return { data }
        case "gov.ua":
            return { data }
        case "km.ua":
            return { data }
        case "online":
            return { data }
        case "zone":
            return { data }
        case "co.rs":
            return { data }
        case "cn":
            return { data }
        case "s3-website.eu-west-2.amazonaws.com":
            return { data }
        case "market":
            return { data }
        case "agency":
            return { data }
        case "com.sg":
            return { data }
        case "house":
            return { data }
        case "nu":
            return { data }
        case "works":
            return { data }
        case "no":
            return { data }
        case "com.gt":
            return { data }
        case "gov.my":
            return { data }
        case "ac.uk":
            return { data }
        case "kh.ua":
            return { data }
    }
}