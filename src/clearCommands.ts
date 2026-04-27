import { appConfig } from "./config.js";
import { clearApplicationCommands } from "./discord/commandRegistry.js";
import { createDiscordRestClient } from "./discord/restClient.js";
import { getDiscordAuthErrorMessage } from "./utils/discordError.js";

async function clearCommands(): Promise<void> {
  const rest = createDiscordRestClient();
  const scope = await clearApplicationCommands(rest);

  if (scope === "guild") {
    console.log(`Cleared guild slash commands for ${appConfig.guildId}.`);
    return;
  }

  console.log("Cleared global slash commands.");
}

void clearCommands().catch((error: unknown) => {
  const message = getDiscordAuthErrorMessage(error);

  if (message) {
    console.error(message);
    process.exit(1);
  }

  console.error("Failed to clear slash commands:", error);
  process.exit(1);
});
