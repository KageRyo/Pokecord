import { Routes } from "discord.js";
import type {
  RESTGetAPIApplicationCommandsResult,
  RESTPostAPIApplicationCommandsJSONBody,
  REST
} from "discord.js";

import { appConfig } from "../config.js";

export async function registerApplicationCommands(
  rest: REST,
  commands: RESTPostAPIApplicationCommandsJSONBody[]
): Promise<"global" | "guild"> {
  if (appConfig.guildId) {
    for (const command of commands) {
      await rest.post(Routes.applicationGuildCommands(appConfig.clientId, appConfig.guildId), {
        body: command
      });
    }

    return "guild";
  }

  for (const command of commands) {
    await rest.post(Routes.applicationCommands(appConfig.clientId), {
      body: command
    });
  }

  return "global";
}

export async function clearApplicationCommands(
  rest: REST,
  commandNames: string[]
): Promise<"global" | "guild"> {
  if (appConfig.guildId) {
    const commands = await rest.get(
      Routes.applicationGuildCommands(appConfig.clientId, appConfig.guildId)
    ) as RESTGetAPIApplicationCommandsResult;

    for (const command of commands) {
      if (!commandNames.includes(command.name)) {
        continue;
      }

      await rest.delete(
        Routes.applicationGuildCommand(appConfig.clientId, appConfig.guildId, command.id)
      );
    }

    return "guild";
  }

  const commands = await rest.get(
    Routes.applicationCommands(appConfig.clientId)
  ) as RESTGetAPIApplicationCommandsResult;

  for (const command of commands) {
    if (!commandNames.includes(command.name)) {
      continue;
    }

    await rest.delete(Routes.applicationCommand(appConfig.clientId, command.id));
  }

  return "global";
}
