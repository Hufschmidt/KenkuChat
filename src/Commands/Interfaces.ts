// Import code from external modules
import { SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction } from 'discord.js';

/**
 * General interface to slash-commands.
 */
interface SlashCommandInterface {
  /**
   * Returns the command-builder to be used by discord.js
   * for building the command managed by this class.
   * @returns An SlashCommandBuilder instance representing this slash-command
   */
  getCommandBuilder(): SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;

  /**
   * Gets the comand name used but interaction lookup.
   * @returns The command string that is registered
   */
  getCommand(): string;

  /**
   * Executes something in response to recieving a matching discord slash-command.
   * @param interaction The discord.js interaction object
   */
  executeCommand(interaction: ChatInputCommandInteraction): Promise<void>;
}

// Export content as module
export {
  type SlashCommandInterface,
};
