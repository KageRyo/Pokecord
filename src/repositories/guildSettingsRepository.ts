import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AppLocale } from "../i18n/locales.js";
import { defaultLocale, isSupportedLocale } from "../i18n/locales.js";
import { ensureDirectory } from "../utils/ensureDirectory.js";

interface GuildSetting {
  locale: AppLocale;
}

interface GuildSettingsData {
  guilds: Record<string, GuildSetting>;
}

const DEFAULT_DATA: GuildSettingsData = { guilds: {} };

export class GuildSettingsRepository {
  private readonly filePath: string;

  public constructor(filePath?: string) {
    this.filePath = filePath ?? path.resolve(process.cwd(), "data", "guild-settings.json");
  }

  public async getLocale(guildId: string): Promise<AppLocale> {
    const data = await this.readData();

    return data.guilds[guildId]?.locale ?? defaultLocale;
  }

  public async setLocale(guildId: string, locale: AppLocale): Promise<void> {
    const data = await this.readData();

    data.guilds[guildId] = { locale };

    await this.writeData(data);
  }

  private async readData(): Promise<GuildSettingsData> {
    try {
      const content = await readFile(this.filePath, "utf-8");
      const parsed = JSON.parse(content) as Partial<GuildSettingsData>;
      const guilds = parsed.guilds ?? {};

      return {
        guilds: Object.fromEntries(
          Object.entries(guilds).flatMap(([guildId, value]) => {
            const locale = value?.locale;

            if (locale && isSupportedLocale(locale)) {
              return [[guildId, { locale }]];
            }

            return [];
          })
        )
      };
    } catch (error) {
      const isMissingFile =
        error instanceof Error &&
        "code" in error &&
        typeof error.code === "string" &&
        error.code === "ENOENT";

      if (isMissingFile) {
        return DEFAULT_DATA;
      }

      throw error;
    }
  }

  private async writeData(data: GuildSettingsData): Promise<void> {
    await ensureDirectory(path.dirname(this.filePath));
    await writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
