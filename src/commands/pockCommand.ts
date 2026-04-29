import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashCommand } from "./command.js";
import { getMessages } from "../i18n/messages.js";
import { LocalizationService } from "../services/localizationService.js";
import { PockService } from "../services/pockService.js";

export class PockCommand implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName("pock")
    .setDescription("Pock another user.")
    .setDescriptionLocalizations({
      ja: "他のユーザーをポックします。",
      "zh-TW": "戳一下其他使用者。"
    })
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to pock.")
        .setDescriptionLocalizations({
          ja: "ポックしたいユーザーです。",
          "zh-TW": "你想戳的使用者。"
        })
        .setRequired(true)
    );

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

    const targetUser = interaction.options.getUser("user", true);
    const actorUser = interaction.user;

    if (targetUser.id === actorUser.id) {
      const messages = await this.localizationService.getMessages(interaction.guildId);

      await interaction.reply({
        content: messages.cannotPockYourself,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await this.pockService.createPock({
      actorUserId: actorUser.id,
      actorDisplayName: actorUser.username,
      targetUserId: targetUser.id,
      targetDisplayName: targetUser.username,
      guildId: interaction.guildId,
      channelId: interaction.channelId
    });

    const messages = await this.localizationService.getMessages(interaction.guildId);

    await interaction.reply({
      content: messages.pockMessage(actorUser.id, targetUser.id)
    });
  }
}
