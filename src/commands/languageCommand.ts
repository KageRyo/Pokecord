import { MessageFlags, SlashCommandBuilder } from "discord.js";
import type { ChatInputCommandInteraction } from "discord.js";

import type { SlashCommand } from "./command.js";
import type { AppLocale } from "../i18n/locales.js";
import { getMessages } from "../i18n/messages.js";
import { LocalizationService } from "../services/localizationService.js";

export class LanguageCommand implements SlashCommand {
  public readonly data = new SlashCommandBuilder()
    .setName("language")
    .setDescription("Change the bot language for this server.")
    .setDescriptionLocalizations({
      ja: "このサーバーのボット言語を変更します。",
      "zh-TW": "切換這個伺服器的機器人語言。"
    })
    .addStringOption((option) =>
      option
        .setName("locale")
        .setDescription("Select a language.")
        .setDescriptionLocalizations({
          ja: "言語を選択してください。",
          "zh-TW": "選擇語言。"
        })
        .setRequired(true)
        .addChoices(
          { name: "English", value: "en" },
          { name: "日本語", value: "ja" },
          { name: "繁體中文", value: "zh-TW" }
        )
    );

  public readonly definition = this.data.toJSON();

  public constructor(private readonly localizationService: LocalizationService) {}

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.inGuild() || !interaction.guildId) {
      await interaction.reply({
        content: getMessages("en").commandOnlyInServer,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const locale = interaction.options.getString("locale", true) as AppLocale;
    const messages = await this.localizationService.setGuildLocale(interaction.guildId, locale);

    await interaction.reply({
      content: messages.languageUpdated,
      flags: MessageFlags.Ephemeral
    });
  }
}
