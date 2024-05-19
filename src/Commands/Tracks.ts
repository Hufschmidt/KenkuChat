// Import code from external modules
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, ChatInputCommandInteraction } from 'discord.js';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { PlaylistService } from '../KenkuAPI/index.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { LoggerInterface } from '../Logger/Interfaces.js';

/**
 * Implements the discord commands related to /kfm-tracks *
 * Implements commands as well as helpers for working with KenkuFM and discord.
 */
class TracksCommand {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /** Stores a reference to the KenkuFM PlaylistService API */
  protected playlist: PlaylistService;

  /**
   * Creates a new discord list command instance,
   * initializes all required references.
   */
  public constructor() {
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
    this.playlist = new PlaylistService();
  }

  /**
   * Returns the command-builder to be used by discord.js
   * for building the command managed by this class.
   * @returns An SlashCommandBuilder instance representing this slash-command
   */
  public getCommand(): SlashCommandSubcommandsOnlyBuilder {
    return new SlashCommandBuilder()
      .setName(`${this.config.getArgument('prefix')}-tracks`)
      .setDescription('Do something related to playlists or tracks.')
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('play')
          .setDescription('Play a playlist or track with given title or unique identifier')
          .addUserOption((option) => {
            return option
              .setName('title')
              .setDescription('The title or unique-identifier of the playlist or track to play');
        });
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('stop')
          .setDescription('Stop playback of an active playlist or track.');
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('pause')
          .setDescription('Pause playback of an active playlist or track.');
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('resume')
          .setDescription('Resume playback of a paused playlist or track.');
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('next')
          .setDescription('Start playback next track of an active playlist.');
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('previous')
          .setDescription('Start playback previous track of an active playlist.');
      })
      .addSubcommand((subcommand) => {
        return subcommand
          .setName('status')
          .setDescription('Returns the current playback status of the active playlist or track.');
      });
  }

  /**
   * Executes something in response to recieving a matching discord slash-command.
   * @param interaction The discord.js interaction object
   */
  public async executeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    // Defer reply to after we got response from KenkuFM
    await interaction.deferReply();

    // WIP
    console.log(interaction);
    await interaction.editReply('This is Work-In-Progress!');
  }
}

// Export content as module
export {
  TracksCommand,
}
