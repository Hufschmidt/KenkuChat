// Import code from external modules
import ky from 'ky';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { KenkuId, KenkuGetSoundboards, KenkuGetSoundState } from './Interfaces.js';
import type { LoggerInterface } from '../Logger/Interfaces.js';
import { KenkuError } from '../Errors/KenkuError.js';

/**
 * Implements the soundboard related KenkuFM remote-control api
 * by wrapping requests and responses into a class.
 */
class SoundboardService {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /**
   * Creates a new Soundboard-WebsService instance,
   * initializes all required references.
   */
  public constructor() {
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
  }

  /**
   * Gets a list of all soundboards and sound-effects contained within them.
   * Implements a GET request to /v1/soundboard with additional
   * logging and input/outpout handling.
   * @returns A list of all soundboards as well as sounds for each soundboard
   * @throws
   */
  public async getList(): Promise<KenkuGetSoundboards> {
    try {
      // Log information and try to send request
      this.logger.info('Fetching list of all soundboards and sound-effects...');
      const json = await ky
        .get(`${this.config.getArgument('url')}/v1/soundboard`)
        .json<KenkuGetSoundboards>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got list of soundboards and sound-effects.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'fetch list of all soundboards and sound-effects'));
      throw error;
    }
  }

  /**
   * Starts playing the given sound-effect. Note that multiple sound-effects can play at the same time!
   * Implements a PUT request to /v1/soundboard/play with payload { "id": <id> }
   * with additional logging and input/outpout handling.
   * @param id The unique identifier of the soundboard sound-effect that should be played
   * @returns The unique identifier of the soundboard sound-effect
   * @throws
   */
  public async play(id: string): Promise<KenkuId> {
    try {
      // Log information and try to send request
      this.logger.info(`Requesting to play sound-effect with id: ${id}`);
      const json = await ky
        .put(`${this.config.getArgument('url')}/v1/soundboard/play`, { json: { id } })
        .json<KenkuId>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got sound-effect playing answer.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'play sound-effect'));
      throw error;
    }
  }

  /**
   * Stops playing the given sound-effect. Note that multiple sound-effects can play at the same time!
   * Implements a PUT request to /v1/soundboard/stop with payload { "id": <id> }
   * with additional logging and input/outpout handling.
   * @param id The unique identifier of the soundboard sound-effect that should be stopped
   * @returns The unique identifier of the soundboard sound-effect
   * @throws
   */
  public async stop(id: string): Promise<KenkuId> {
    try {
      // Log information and try to send request
      this.logger.info(`Requesting to stop sound-effect with id: ${id}`);
      const json = await ky
        .put(`${this.config.getArgument('url')}/v1/soundboard/stop`, { json: { id } })
        .json<KenkuId>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got sound-effect stopping answer.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'stop sound-effect'));
      throw error;
    }
  }

  /**
   * Gets the current state of any playing sound-effects (progress, duration, looping, etc.).
   * Implements a GET request to /v1/soundboard/playback
   * with additional logging and input/outpout handling.
   * @returns The current state of any playing sound-effects
   * @throws
   */
  public async getState(): Promise<KenkuGetSoundState> {
    try {
      // Log information and try to send request
      this.logger.info('Requesting current soundboard state...');
      const json = await ky
        .get(`${this.config.getArgument('url')}/v1/soundboard/playback`)
        .json<KenkuGetSoundState>();

      // Log information and pass response
      this.logger.debug({ json }, 'Got soundboard state answer.');
      return json;
    } catch (error) {
      this.logger.error({ error }, KenkuError.handleException(error, 'fetch soundboard state'));
      throw error;
    }
  }
}

// Export content as module
export {
  SoundboardService,
};
