import { SlashCommandBuilder, ChatInputCommandInteraction, bold, italic } from 'discord.js';
import ky from 'ky';

import { KenkuGetSoundboards } from './interfaces.js';
import * as config from '../../config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
  .setName('sound')
  .setDescription('Play sound by given id.')
  .addStringOption((option) => {
		return option.setName('mode')
			.setDescription('Play or stop sound.')
      .addChoices(
        { name: 'play', value: 'play' },
        { name: 'stop', value: 'stop' },
      )
      .setRequired(true);
  })
  .addStringOption((option) => {
		return option.setName('sound')
			.setDescription('The name or track-id of the sound to play.')
      .setRequired(true);
  })
  .setDMPermission(false);

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  const mode = <string> interaction.options.getString('mode');
  const nameOrId = <string> interaction.options.getString('sound');
  const isUUID = nameOrId.toLowerCase().match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

  try {
    if (isUUID) {
      await ky.put(`${config.default.url}/v1/soundboard/${mode}`,  { json: { id: nameOrId }}).json();
      await interaction.editReply(`Now ${mode}ing soundboard sound: ${bold(nameOrId)}`);
    }
    else {
      const json: KenkuGetSoundboards = await ky.get(`${config.default.url}/v1/soundboard`).json();

      const matchByTitle = json.sounds.find((soundboard) => { return soundboard.title === nameOrId; });
      if (matchByTitle) {
        await ky.put(`${config.default.url}/v1/soundboard/${mode}`,  { json: { id: matchByTitle.id }}).json();
        await interaction.editReply(`Now ${mode}ing soundboard sound: ${bold(matchByTitle.id)}: ${italic(nameOrId)}`);
      } else {
        await interaction.editReply(`Could not find any sound matching: ${bold(nameOrId)}`);
      }
    }
  } catch (error) {
		console.error(error);
    await interaction.editReply(`Error: Unable to ${mode} sound...`);
	}
};

export {
  data,
  execute,
};
