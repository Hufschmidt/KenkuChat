import { SlashCommandBuilder, ChatInputCommandInteraction, bold, italic } from 'discord.js';
import ky from 'ky';

import { KenkuGetSoundboards } from './interfaces.js';
import * as config from '../../config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
  .setName('soundboards')
  .setDescription('List all soundboards.')
  .setDMPermission(false);

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  try {
    const json: KenkuGetSoundboards = await ky.get(`${config.default.url}/v1/soundboard`).json();
    const soundboards = json.soundboards.map((entry) => { return `- ${bold(entry.id)}: '${italic(entry.title)}'`; });

    await interaction.editReply(`List of soundboards:\n${soundboards.join('\n')}`);
  } catch (error) {
		console.error(error);
    await interaction.editReply('Error: Unable to fetch soundboards...');
	}
};

export {
  data,
  execute,
};
