import { Routes } from "discord.js";
import type { RESTPostAPIApplicationCommandsJSONBody, REST } from "discord.js";

import { appConfig } from "../config.js";

export async function registerApplicationCommands(
  rest: REST,
  commands: RESTPostAPIApplicationCommandsJSONBody[]
): Promise<"global" | "guild"> {
  if (appConfig.guildId) {
    await rest.put(Routes.applicationGuildCommands(appConfig.clientId, appConfig.guildId), {
      body: commands
    });

    return "guild";
  }

  await rest.put(Routes.applicationCommands(appConfig.clientId), {
    body: commands
  });

  return "global";
}

export async function clearApplicationCommands(rest: REST): Promise<"global" | "guild"> {
  return registerApplicationCommands(rest, []);
}
