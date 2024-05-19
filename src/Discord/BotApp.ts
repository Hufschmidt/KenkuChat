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

  protected commands: Collection<string, SlashCommandInterface>;

  protected client: Client;

  public constructor() {
    this.config = new Config();
    this.logger = LoggerFactory(this.constructor.name);
    this.client = new Client({ intents: [GatewayIntentBits.Guilds] });

    this.commands = new Collection<string, SlashCommandInterface>();
    this.loadCommand(new ListCommand());
    this.loadCommand(new PlayCommand());
    this.loadCommand(new SearchCommand());
    this.loadCommand(new SoundEffectsCommand());
    this.loadCommand(new StatusCommand());
    this.loadCommand(new TracksCommand());
  }

  public async main(): Promise<void> {
    this.logger.info('Setting up discord client...');

    this.client.once(Events.ClientReady, this.OnceClientReady.bind(this));
    this.client.on(Events.InteractionCreate, this.OnInteractionCreate.bind(this));

    await this.client.login(this.config.getArgument('token'));

    process.on('SIGINT', async () => {
      await this.client.destroy();
      this.logger.info('Closed KenkuChat connection.');
    });
  }

  public async registerCommands(): Promise<void> {
    this.logger.info('Setting up discord application slash-commands...');

    const rest = new REST()
    rest.setToken(this.config.getArgument('token'));

    try {
      const commandData = this.commands.map((command) => { return command.getCommandBuilder().toJSON(); });
      this.logger.info(`Refreshing ${commandData.length} discord application slash-commands...`);

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

  protected loadCommand(command: SlashCommandInterface): void {
    this.commands.set(command.getCommand(), command);
  }

  protected async OnceClientReady(): Promise<void> {
    this.logger.info(`KenkuChat ready, logged in as ${this.client.user?.tag}.`);
  }

  protected async OnInteractionCreate(interaction: Interaction): Promise<void> {
    if (!interaction.isChatInputCommand()) { return; }

    const command = this.commands.get(interaction.commandName);
    if (!command) {
      this.logger.warn(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      this.logger.info(`Executing command matching: ${interaction.commandName}`);
      await command.executeCommand(interaction);
    } catch (error) {
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
}
