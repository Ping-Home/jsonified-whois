import whois from "../index.js"

const url = 'google.com'

const result = await whois({ url })

console.log(result)