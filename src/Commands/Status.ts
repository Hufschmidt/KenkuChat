// Import code from external modules
import { SlashCommandBuilder, SlashCommandSubcommandsOnlyBuilder, italic } from 'discord.js';
import moment from 'moment';
import momentDurationFormat from 'moment-duration-format';

// Import types from external modules
import type { ChatInputCommandInteraction } from 'discord.js';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { PlaylistService, SoundboardService } from '../KenkuAPI/index.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { SlashCommandInterface } from './Interfaces.js';
import type { LoggerInterface } from '../Logger/Interfaces.js';
import { KenkuError } from '../Errors/KenkuError.js';

// Apply duration-format to moment instance
momentDurationFormat(<any> moment);

/**
 * Implements the discord commands related to /kfm-status *
 * Implements commands as well as helpers for working with KenkuFM and discord.
 */
class StatusCommand implements SlashCommandInterface {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /** Stores a reference to the KenkuFM PlaylistService API */
  protected playlist: PlaylistService;

  /** Stores a reference to the KenkuFM SoundboardService API */
  protected soundboard: SoundboardService;

  /**
   * Creates a new discord status command instance,
   * initializes all required references.
   */
  public constructor() {
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
    this.playlist = new PlaylistService();
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
      .setDescription('Fetch status about currently playing tracks and sound-effects.');
  }

  /**
   * Gets the comand name used but interaction lookup.
   * @returns The command string that is registered
   */
  public getCommand(): string {
    return `${this.config.getArgument('prefix')}-status`;
  }

  /**
   * Executes something in response to recieving a matching discord slash-command.
   * @param interaction The discord.js interaction object
   */
  public async executeCommand(interaction: ChatInputCommandInteraction): Promise<void> {
    // Defer reply to after we got response from KenkuFM
    await interaction.deferReply();

    try {
      // Fetch status for all playlists and soundboards
      const playlist = await this.playlist.getState();
      const soundboard = await this.soundboard.getState();

      const trackInfo = (playlist.track && playlist.playlist)
        ? `Currently ${(playlist.playing) ? 'playing' : 'paused'} track ${italic(playlist.track.title)} from playlist ${italic(playlist.playlist.title)} (Progress: ${moment.duration(playlist.track.progress, 'seconds').format()} / ${moment.duration(playlist.track.duration, 'seconds').format()})`
        : 'No playlist or track is currently playing.';

      const soundList = soundboard.sounds.map((sound) => {
        return `- ${italic(sound.title)} (Progress: ${moment.duration(sound.progress, 'seconds').format()} / ${moment.duration(sound.duration, 'seconds').format()})`;
      });
      const soundInfo = (soundboard.sounds.length > 0)
        ? `Currently playing sound-effects:\n${soundList.join('\n')}`
        : 'Currently not playing any soundboard or sound-effect.';

      // Output status information
      await interaction.editReply(`${trackInfo}\n${soundInfo}`);
    } catch (error) {
      // Log error to console
      this.logger.error({ error }, `Got unexpected exception when executing command in ${this.constructor.name}.`);

      // Send information to discord
      if (KenkuError.isUnavailableException(error) || KenkuError.isTimeout(error)) {
        await interaction.editReply('**Warning**: Cannot talk to KenkuFM remote-control api, see KenkuChat logs!');
      } else {
        await interaction.editReply('**Error**: Caught an unknown exception, see KenkuChat logs!');
      }
    }
  }
}

// Export content as module
export {
  StatusCommand,
};
