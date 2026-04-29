import { MessageFlags, SlashCommandBuilder, userMention } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashCommand } from "./command.js";
import { getMessages } from "../i18n/messages.js";
import { LocalizationService } from "../services/localizationService.js";
import { PockService } from "../services/pockService.js";

export class PockHistoryCommand implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName("pock-history")
    .setDescription("Show recent pock activity in this server.")
    .setDescriptionLocalizations({
      ja: "このサーバーの最近のポック履歴を表示します。",
      "zh-TW": "顯示這個伺服器最近的戳人紀錄。"
    });

  public readonly definition = this.data.toJSON();

  public constructor(
    private readonly pockService: PockService,
    private readonly localizationService: LocalizationService
  ) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inGuild() || !interaction.guildId) {
      await interaction.reply({
        content: getMessages("en").commandOnlyInServer,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const messages = await this.localizationService.getMessages(interaction.guildId);
    const records = await this.pockService.getRecentGuildPocks(interaction.guildId, 10);

    if (records.length === 0) {
      await interaction.reply(messages.noPockHistory);
      return;
    }

    const lines = records.map((record, index) => {
      const happenedAt = `<t:${Math.floor(new Date(record.createdAt).getTime() / 1000)}:R>`;
      return `${index + 1}. ${userMention(record.actorUserId)} pocked ${userMention(record.targetUserId)} ${happenedAt}`;
    });

    await interaction.reply({
      content: [messages.recentPockHistoryTitle, ...lines].join("\n")
    });
  }
}
