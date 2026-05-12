export default {
  name: "ping",
  description: "Replies with Pong and latency!",
  execute: async (context) => {
    const { client, reply } = context;
    return reply(`🏓 Pong! Latency is ${client.ws.ping}ms.`);
  }
};
