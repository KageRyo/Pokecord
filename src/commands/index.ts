import type { SlashCommand } from "./command.js";
import { LanguageCommand } from "./languageCommand.js";
import { PockCommand } from "./pockCommand.js";
import { PockHistoryCommand } from "./pockHistoryCommand.js";
import { GuildSettingsRepository } from "../repositories/guildSettingsRepository.js";
import { PockHistoryRepository } from "../repositories/pockHistoryRepository.js";
import { LocalizationService } from "../services/localizationService.js";
import { PockService } from "../services/pockService.js";

export function buildCommands(): SlashCommand[] {
  const pockHistoryRepository = new PockHistoryRepository();
  const guildSettingsRepository = new GuildSettingsRepository();
  const pockService = new PockService(pockHistoryRepository);
  const localizationService = new LocalizationService(guildSettingsRepository);

  return [
    new PockCommand(pockService, localizationService),
    new PockHistoryCommand(pockService, localizationService),
    new LanguageCommand(localizationService)
  ];
}
