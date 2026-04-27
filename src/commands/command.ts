import type {
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody
} from "discord.js";

interface CommandData {
  readonly name: string;
  toJSON(): RESTPostAPIApplicationCommandsJSONBody;
}

export interface SlashCommand {
  readonly data: CommandData;
  readonly definition: RESTPostAPIApplicationCommandsJSONBody;
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
