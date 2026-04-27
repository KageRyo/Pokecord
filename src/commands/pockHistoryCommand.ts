import { SlashCommandBuilder, userMention } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashCommand } from "./command.js";
import { PockService } from "../services/pockService.js";

export class PockHistoryCommand implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName("pock-history")
    .setDescription("Show recent pock activity in this server.");

  public readonly definition = this.data.toJSON();

  public constructor(private readonly pockService: PockService) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inGuild() || !interaction.guildId) {
      await interaction.reply({
        content: "This command can only be used inside a server.",
        ephemeral: true
      });
      return;
    }

    const records = await this.pockService.getRecentGuildPocks(interaction.guildId, 10);

    if (records.length === 0) {
      await interaction.reply("No pock history yet.");
      return;
    }

    const lines = records.map((record, index) => {
      const happenedAt = `<t:${Math.floor(new Date(record.createdAt).getTime() / 1000)}:R>`;
      return `${index + 1}. ${userMention(record.actorUserId)} pocked ${userMention(record.targetUserId)} ${happenedAt}`;
    });

    await interaction.reply({
      content: ["Recent pock history:", ...lines].join("\n")
    });
  }
}
