import { client } from "./client.js";
import registerEvents from "./events/index.js";

registerEvents(client);

client.login(process.env.LOGIN_TOKEN);
