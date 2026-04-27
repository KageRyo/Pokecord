import type { AppLocale } from "../i18n/locales.js";
import { defaultLocale } from "../i18n/locales.js";
import { getMessages, type I18nMessages } from "../i18n/messages.js";
import { GuildSettingsRepository } from "../repositories/guildSettingsRepository.js";

export class LocalizationService {
  public constructor(private readonly repository: GuildSettingsRepository) {}

  public async getLocale(guildId?: string): Promise<AppLocale> {
    if (!guildId) {
      return defaultLocale;
    }

    return this.repository.getLocale(guildId);
  }

  public async getMessages(guildId?: string): Promise<I18nMessages> {
    const locale = await this.getLocale(guildId);

    return getMessages(locale);
  }

  public async setGuildLocale(guildId: string, locale: AppLocale): Promise<I18nMessages> {
    await this.repository.setLocale(guildId, locale);

    return getMessages(locale);
  }
}
