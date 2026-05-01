import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";

import { buildCommands } from "./commands/index.js";
import { appConfig } from "./config.js";
import { getMessages } from "./i18n/messages.js";
import { getDiscordAuthErrorMessage } from "./utils/discordError.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = buildCommands();
const commandMap = new Map(commands.map((command) => [command.data.name, command]));

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.Error, (error) => {
  console.error("Discord client error:", error);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commandMap.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("Failed to execute command:", error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: getMessages("en").genericCommandError,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.reply({
      content: getMessages("en").genericCommandError,
      flags: MessageFlags.Ephemeral
    });
  }
});

void client.login(appConfig.discordToken).catch((error: unknown) => {
  const message = getDiscordAuthErrorMessage(error);

  if (message) {
    console.error(message);
    process.exit(1);
  }

  console.error("Failed to start Discord client:", error);
  process.exit(1);
});
