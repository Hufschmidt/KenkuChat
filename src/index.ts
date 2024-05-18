import { Client, Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import yargs from 'yargs/yargs';

import { UpdateCommandResponse } from './interfaces.js'
import { Command } from './commands/interfaces.js';
import * as SoundBoardsCommand from './commands/soundboards.js';
import * as SoundsCommand from './commands/sounds.js';
import * as SoundCommand from './commands/sound.js';
import * as StatusCommand from './commands/status.js';
import * as config from '../config.json' assert { type: "json" };

const argv = yargs(process.argv.slice(2)).options({
  update: { type: 'boolean', default: false },
  global: { type: 'boolean', default: false },
}).parseSync();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = new Collection<string, Command>();
commands.set(SoundBoardsCommand.data.name, SoundBoardsCommand);
commands.set(SoundsCommand.data.name, SoundsCommand);
commands.set(SoundCommand.data.name, SoundCommand);
commands.set(StatusCommand.data.name, StatusCommand);

client.once(Events.ClientReady, async (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) { return; }

  const command = commands.get(interaction.commandName);
  if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  client.destroy().then(() => {
    console.log('destroyed...');
  });
});

const rest = new REST().setToken(config.default.token);
const UpdateCommands = async (): Promise<void> => {
	try {
    const commandsJSON = commands.map((command) => { return command.data.toJSON(); });
		console.log(`Started refreshing ${commandsJSON.length} application (/) commands.`);

    if (argv.global) {
      console.log(`Updating for Application <${config.default.applicationId}> globally`);
    } else {
      console.log(`Updating for Application <${config.default.applicationId}> and Server <${config.default.serverId}>`);
    }
		const data = (argv.global)
      ? <UpdateCommandResponse> await rest.put(
        Routes.applicationCommands(`${config.default.applicationId}`),
        { body: commands },
      )
      : <UpdateCommandResponse> await rest.put(
        Routes.applicationGuildCommands(`${config.default.applicationId}`, `${config.default.serverId}`),
        { body: commandsJSON },
      );

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
};

if (argv.update) { await UpdateCommands(); }

console.log(`Logging in using token: ${config.default.token}`);
await client.login(config.default.token);
console.log('Done, awaiting...');
