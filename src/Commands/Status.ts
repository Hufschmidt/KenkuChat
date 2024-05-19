// Import code from external modules
import { SlashCommandBuilder, italic } from 'discord.js';
import { HTTPError, TimeoutError } from 'ky';

// Import types from external modules
import type { ChatInputCommandInteraction } from 'discord.js';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { PlaylistService, SoundboardService } from '../KenkuAPI/index.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { LoggerInterface } from '../Logger/Interfaces.js';

/**
 * Implements the discord commands related to /kfm-status *
 * Implements commands as well as helpers for working with KenkuFM and discord.
 */
class StatusCommand {
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
  public getCommand(): SlashCommandBuilder {
    return new SlashCommandBuilder()
      .setName(`${this.config.getArgument('prefix')}-status`)
      .setDescription('Fetch status about currently playing tracks and sound-effects.');
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

      // Build output information
      const trackInfo = [
        `- **Title**: ${italic(playlist.track.title)}`,
        `- **Playlist**: ${italic(playlist.playlist.title)}`,
        `- **Progress**: ${Math.round(playlist.track.progress)} / ${Math.round(playlist.track.duration)}`,
      ].join('\n');
      const soundInfo = soundboard.sounds.map((sound) => {
        return [
          `- **Title**: ${italic(sound.title)}`,
          `- **Progress**: ${Math.round(sound.progress)} / ${Math.round(sound.duration)}`,
        ].join('\n');
      }).join('Sound-Effect:\n');

      // Output status information
      await interaction.editReply(`Currently playing following:\n${trackInfo}\n${soundInfo}`);
    } catch (error) {
      // Inform discord about error
      if (error instanceof HTTPError) { await interaction.editReply('Error: KenkuFM remote-control API triggered HTTP exception, see KenkuChat logs!'); }
      else if (error instanceof TimeoutError) { await interaction.editReply('Error: KenkuFM remote-control API timed out!'); }
      else { await interaction.editReply('Error: Unknown exception, see KenkuChat logs!'); }
    }
  }
}

// Export content as module
export {
  StatusCommand,
}
