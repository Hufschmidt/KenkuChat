// Import code from external modules
import ky from 'ky';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { KenkuId, KenkuGetPlaylists, KenkuGetTrackState } from './Interfaces.js';
import type { LoggerInterface } from '../Logger/Interfaces.js';
import { KenkuError } from '../Errors/KenkuError.js';

/**
 * Implements the playlist related KenkuFM remote-control api
 * by wrapping requests and responses into a class.
 */
class PlaylistService {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /**
   * Creates a new Playlist-WebsService instance,
   * initializes all required references.
   */
  public constructor() {
    // Store references
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
  }

  /**
   * Gets a list of all playlists and tracks contained within them.
   * Implements a GET request to /v1/playlist with additional
   * logging and input/outpout handling.
   * @returns A list of all playlists as well as tracks for each playlist
   * @throws
   */
  public async getList(): Promise<KenkuGetPlaylists> {
    try {
      // Log information and try to send request
      this.logger.info('Fetching list of all playlists and tracks...');
      const json = await ky
        .get(`${this.config.getArgument('url')}/v1/playlist`)
        .json<KenkuGetPlaylists>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got list of playlists and tracks.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'fetch list of all playlists and tracks'));
      throw error;
    }
  }

  /**
   * Starts playing the given playlist or track. Note that only one track can play at the same time!
   * Implements a PUT request to /v1/playlist/play with payload { "id": <id> }
   * with additional logging and input/outpout handling.
   * @param id The unique identifier of the playlist or track that should be played
   * @returns The unique identifier of the playlist or track
   * @throws
   */
  public async play(id: string): Promise<KenkuId> {
    try {
      // Log information and try to send request
      this.logger.info(`Requesting to play playlist or track with id: ${id}`);
      const json = await ky
        .put(`${this.config.getArgument('url')}/v1/playlist/play`, { json: { id } })
        .json<KenkuId>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got playlist or track playing answer.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'play playlist or track'));
      throw error;
    }
  }

  /**
   * Pauses a playing playlist or track.
   * Implements a PUT request to /v1/playlist/playback/pause
   * with additional logging and input/outpout handling.
   * @throws
   */
  public async pause(): Promise<void> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting to pause currently playing playlist or track...');
      await ky.put(`${this.config.getArgument('url')}/v1/playlist/playback/pause`);

      // Log information and pass response
      this.logger.debug('Got playlist or track pause answer.');
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'pause playlist or track'));
      throw error;
    }
  }

  /**
   * Resumes a paused playlist or track.
   * Implements a PUT request to /v1/playlist/playback/play
   * with additional logging and input/outpout handling.
   * @throws
   */
  public async resume(): Promise<void> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting to resume currently paused playlist or track...');
      await ky.put(`${this.config.getArgument('url')}/v1/playlist/playback/play`);

      // Log information and pass response
      this.logger.debug('Got playlist or track resume answer.');
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'resume playlist or track'));
      throw error;
    }
  }

  /**
   * (Shuffle) to next track in current playlist.
   * Implements a PUT request to /v1/playlist/playback/next
   * with additional logging and input/outpout handling.
   * @throws
   */
  public async next(): Promise<void> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting to play next track inside current playlist...');
      await ky.put(`${this.config.getArgument('url')}/v1/playlist/playback/next`);

      // Log information and pass response
      this.logger.debug('Got next track answer.');
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'play next track in playlist'));
      throw error;
    }
  }

  /**
   * (Shuffle) to next track in current playlist.
   * Implements a PUT request to /v1/playlist/playback/next
   * with additional logging and input/outpout handling.
   * @throws
   */
  public async previous(): Promise<void> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting to play previous track inside current playlist...');
      await ky.put(`${this.config.getArgument('url')}/v1/playlist/playback/previous`);

      // Log information and pass response
      this.logger.debug('Got previous track answer.');
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'play previous track in playlist'));
      throw error;
    }
  }

  /**
   * Gets the current state if any playlist is currently playing (progress, duration, repeating, etc.).
   * Implements a GET request to /v1/soundboard/playback
   * with additional logging and input/outpout handling.
   * @returns The current state of any playing sound-effects
   * @throws
   */
  public async getState(): Promise<KenkuGetTrackState> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting current playlist state...');
      const json = await ky
        .get(`${this.config.getArgument('url')}/v1/playlist/playback`)
        .json<KenkuGetTrackState>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got playlist state answer.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'fetch soundboard state'));
      throw error;
    }
  }
}

// Export content as module
export {
  PlaylistService,
};
