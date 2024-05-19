// Import code from external modules
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction } from 'discord.js';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { SoundboardService } from '../KenkuAPI/index.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { SlashCommandInterface } from './Interfaces.js';
import type { LoggerInterface } from '../Logger/Interfaces.js';

/**
 * Implements the discord commands related to /kfm-soundeffects *
 * Implements commands as well as helpers for working with KenkuFM and discord.
 */
class SoundEffectsCommand implements SlashCommandInterface {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /** Stores a reference to the KenkuFM SoundboardService API */
  protected soundboard: SoundboardService;

  /**
   * Creates a new discord soundeffects command instance,
   * initializes all required references.
   */
  public constructor() {
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
    this.soundboard = new SoundboardService();
  }

  /**
   * Returns the command-builder to be used by discord.js
   * for building the command managed by this class.
   * @returns An SlashCommandBuilder instance representing this slash-command
   */
  public getCommandBuilder(): SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName(this.getCommand())
      .setDescription('Do something related to soundboards and sound-effects.')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('play')
          .setDescription('Play a soundboard or sound-effect with given title or unique identifier.')
          .addUserOption((option) => {
            return option
              .setName('title')
              .setDescription('The title or unique-identifier of the soundboard or sound-effect to play.');
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('stop')
          .setDescription('Stop soundboard or sound-effect with given title or unique identifier.')
          .addUserOption((option) => {
            return option
              .setName('title')
              .setDescription('The title or unique-identifier of the soundboard or sound-effect to stop.');
          });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('status')
          .setDescription('Returns the current playback status of any active soundboard or sound-effect.');
      });
  }

  /**
   * Gets the comand name used but interaction lookup.
   * @returns The command string that is registered
   */
  public getCommand(): string {
    return `${this.config.getArgument('prefix')}-sounds`;
  }

  /**
   * Executes something in response to recieving a matching discord slash-command.
   * @param interaction The discord.js interaction object
   */
  public async executeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    // Defer reply to after we got response from KenkuFM
    await interaction.deferReply();

    // WIP
    this.logger.info(interaction);
    await interaction.editReply('This is Work-In-Progress!');
  }
}

// Export content as module
export {
  SoundEffectsCommand,
};
