import { REST, Routes } from "discord.js";

import { buildCommands } from "./commands/index.js";
import { appConfig } from "./config.js";
import { getDiscordAuthErrorMessage } from "./utils/discordError.js";

async function registerCommands(): Promise<void> {
  const commands = buildCommands().map((command) => command.definition);
  const rest = new REST({ version: "10" }).setToken(appConfig.discordToken);

  if (appConfig.guildId) {
    await rest.put(Routes.applicationGuildCommands(appConfig.clientId, appConfig.guildId), {
      body: commands
    });

    console.log(`Registered ${commands.length} slash commands in guild ${appConfig.guildId}.`);
    return;
  }

  await rest.put(Routes.applicationCommands(appConfig.clientId), {
    body: commands
  });

  console.log(`Registered ${commands.length} global slash commands.`);
}

void registerCommands().catch((error: unknown) => {
  const message = getDiscordAuthErrorMessage(error);

  if (message) {
    console.error(message);
    process.exit(1);
  }

  console.error("Failed to register slash commands:", error);
  process.exit(1);
});
