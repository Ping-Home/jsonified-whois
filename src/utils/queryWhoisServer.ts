import net from "net";

type GetWhoisData = (
  domain: string,
  whoisServer: string,
  port: number
) => Promise<string>;

export const queryWhoisServer: GetWhoisData = async (
  domain,
  whoisServer,
  port
) => {
  return new Promise((resolve, reject) => {
    let data = "";
    const socket = net.createConnection({ host: whoisServer, port: port }, () =>
      socket.write(domain + "\r\n")
    );
    socket.setTimeout(60000);
    socket.on("data", (chunk) => (data += chunk));
    socket.on("close", () => resolve(data));
    socket.on("timeout", () => socket.destroy(new Error("Timeout")));
    socket.on("error", reject);
  });
};
