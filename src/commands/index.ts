import type { SlashCommand } from "./command.js";
import { PockCommand } from "./pockCommand.js";
import { PockHistoryCommand } from "./pockHistoryCommand.js";
import { PockHistoryRepository } from "../repositories/pockHistoryRepository.js";
import { PockService } from "../services/pockService.js";

export function buildCommands(): SlashCommand[] {
  const repository = new PockHistoryRepository();
  const pockService = new PockService(repository);

  return [new PockCommand(pockService), new PockHistoryCommand(pockService)];
}
