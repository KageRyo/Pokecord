import { REST } from "discord.js";

import { appConfig } from "../config.js";

export function createDiscordRestClient(): REST {
  return new REST({ version: "10" }).setToken(appConfig.discordToken);
}
