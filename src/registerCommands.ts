import { buildCommands } from "./commands/index.js";
import { appConfig } from "./config.js";
import { registerApplicationCommands } from "./discord/commandRegistry.js";
import { createDiscordRestClient } from "./discord/restClient.js";
import { getDiscordAuthErrorMessage } from "./utils/discordError.js";

async function registerCommands(): Promise<void> {
  const commands = buildCommands().map((command) => command.definition);
  const rest = createDiscordRestClient();
  const scope = await registerApplicationCommands(rest, commands);

  if (scope === "guild") {
    console.log(`Registered ${commands.length} slash commands in guild ${appConfig.guildId}.`);
    return;
  }

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
