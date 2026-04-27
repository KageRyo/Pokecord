import { SlashCommandBuilder, userMention } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashCommand } from "./command.js";
import { PockService } from "../services/pockService.js";

export class PockCommand implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName("pock")
    .setDescription("Pock another user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user you want to pock.").setRequired(true)
    );

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

    const targetUser = interaction.options.getUser("user", true);
    const actorUser = interaction.user;

    if (targetUser.id === actorUser.id) {
      await interaction.reply({
        content: "You cannot pock yourself.",
        ephemeral: true
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

    await interaction.reply({
      content: `${userMention(actorUser.id)} pocked ${userMention(targetUser.id)}.`
    });
  }
}
