// Import code from external modules
import { Client, Collection, Events, GatewayIntentBits, Interaction, REST, Routes } from 'discord.js';

// Import code from internal modules
import { Config } from '../Config/Config.js';
import { ListCommand, PlayCommand, SearchCommand, SoundEffectsCommand, StatusCommand, TracksCommand } from '../Commands/index.js';
import { LoggerFactory } from '../Logger/Factory.js';

// Import types from internal modules
import type { UpdateCommandResponse } from './Interfaces.js';
import type { SlashCommandInterface } from '../Commands/Interfaces.js';
import type { LoggerInterface } from '../Logger/Interfaces.js';

class BotApp {
  /** Stores a reference for the config parser */
  protected config: Config;

  /** Stores a reference to the internal logger instance */
  protected logger:LoggerInterface;

  /** Stores a list of all loaded commands */
  protected commands: Collection<string, SlashCommandInterface>;

  /** Stores a reference to the discord.js client */
  protected client: Client;

  /**
   * Creates a new discord bot application instance,
   * initializes all required references and commands.
   */
  public constructor() {
    // Store references
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    // Register command
    this.commands = new Collection<string, SlashCommandInterface>();
    this.loadCommand(new ListCommand());
    this.loadCommand(new PlayCommand());
    this.loadCommand(new SearchCommand());
    this.loadCommand(new SoundEffectsCommand());
    this.loadCommand(new StatusCommand());
    this.loadCommand(new TracksCommand());
  }

  /**
   * Starts the discord bot and registers all
   * required callbacks.
   * @throws
   */
  public async main(): Promise<void> {
    this.logger.info('Setting up discord client...');

    // Register discord events
    this.client.once(Events.ClientReady, this.OnceClientReady.bind(this));
    this.client.on(Events.InteractionCreate, this.OnInteractionCreate.bind(this));

    // Login and start discord client
    await this.client.login(this.config.getArgument('token'));

    // Register shutdown hook to destroy discord client
    process.on('SIGINT', async () => {
      await this.client.destroy();
      this.logger.info('Closed KenkuChat connection.');
    });
  }

  /**
   * Registers available commands with the discord servers.
   * Note: There is a rate-limit on this, so only execute this when required.
   * @throws
   */
  public async registerCommands(): Promise<void> {
    this.logger.info('Setting up discord application slash-commands...');

    // Create REST client for talking with discord API
    const rest = new REST();
    rest.setToken(this.config.getArgument('token'));

    try {
      // Convert bot commands into required json data
      const commandData = this.commands.map((command) => { return command.getCommandBuilder().toJSON(); });
      this.logger.info(`Refreshing ${commandData.length} discord application slash-commands...`);

      // Update bot commands for all or single server
      const serverId = this.config.getArgument('serverId');
      const applicationId = this.config.getArgument('applicationId');
      if (serverId) {
        const json = <UpdateCommandResponse> await rest.put(Routes.applicationGuildCommands(applicationId, serverId), { body: commandData });
        this.logger.info(`Successfully reloaded ${json.length} discord application slash-commands on single server.`);
      } else {
        const json = <UpdateCommandResponse> await rest.put(Routes.applicationCommands(applicationId), { body: commandData });
        this.logger.info(`Successfully reloaded ${json.length} discord application slash-commands globally.`);
      }
    } catch (error) {
      this.logger.error({ error }, 'Got unexpected exception when setting up discord application slash-commands.');
      throw error;
    }
  }

  /**
   * Stores reference to loaded command for
   * a) executing command when slash-command is detected
   * and
   * b) registering command with discord api
   * @param command The command class that will be stored/loaded
   */
  protected loadCommand(command: SlashCommandInterface): void {
    this.commands.set(command.getCommand(), command);
  }

  /**
   * Executed when discord.js client send event @Events.ClientReady
   * This will be called once when the client is connected and ready to use.
   */
  protected async OnceClientReady(): Promise<void> {
    this.logger.info(`KenkuChat ready, logged in as ${this.client.user?.tag}.`);
  }

  /**
   * Executed when discord.js client send event @Events.InteractionCreate
   * This will be called when recieving a chat interaction from discord.
   * @param interaction Contains details about the interaction as formated by discord.js
   */
  protected async OnInteractionCreate(interaction: Interaction): Promise<void> {
    // We are currently only interested in chat input command
    if (!interaction.isChatInputCommand()) { return; }

    // Check wether it is a command for which we have a registered handler
    const command = this.commands.get(interaction.commandName);
    if (!command) {
      this.logger.warn(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    // Executes the requested command with all arguments wrapped into exception handling
    try {
      this.logger.info(`Executing command matching: ${interaction.commandName}`);
      await command.executeCommand(interaction);
    } catch (error) {
      // Log any error and send some very basic information to discord
      this.logger.error({ error }, 'Got unexpected exception when delegating command execution.');
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: `**Error**: There was an exception when executing command ${interaction.commandName}, see KenkuCHat logs!`, ephemeral: true });
      } else {
        await interaction.reply({ content: `**Error**: There was an exception when executing command ${interaction.commandName}, see KenkuCHat logs!`, ephemeral: true });
      }
    }
  }
}

// Export content as module
export {
  BotApp,
};
