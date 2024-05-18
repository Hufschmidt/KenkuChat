import { SlashCommandBuilder, ChatInputCommandInteraction, bold, italic } from 'discord.js';
import ky from 'ky';

import { KenkuGetSoundboards } from './interfaces.js';
import * as config from '../../config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
  .setName('sounds')
  .setDescription('List all sound-tracks of a soundboard.')
  .addStringOption((option) => {
		return option.setName('board')
			.setDescription('The name or soundboard-id to list sounds for.')
      .setRequired(true);
  })
  .setDMPermission(false);

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();
  const nameOrId = <string> interaction.options.getString('board');

  try {
    const json: KenkuGetSoundboards = await ky.get(`${config.default.url}/v1/soundboard`).json();
    const matchById = json.soundboards.find((soundboard) => { return soundboard.id === nameOrId; });
    const matchByTitle = json.soundboards.find((soundboard) => { return soundboard.title === nameOrId; });

    if (matchById) {
      const sounds = matchById.sounds.map((entry) => {
        return json.sounds.find((sound) => {
          return sound.id === entry;
        });
      })
      .filter((entry) => { return entry !== undefined; })
      .map((entry) => { return `- ${bold(entry?.id ?? '-')}: '${italic(entry?.title ?? '-')}'` });
      await interaction.editReply(`List of sounds in soundboard '${bold(matchById.title)}':\n${sounds.join('\n')}`);
    }
    else if (matchByTitle) {
      const sounds = matchByTitle.sounds.map((entry) => {
        return json.sounds.find((sound) => {
          return sound.id === entry;
        });
      })
      .filter((entry) => { return entry !== undefined; })
      .map((entry) => { return `- ${bold(entry?.id ?? '-')}: '${italic(entry?.title ?? '-')}'` });
      await interaction.editReply(`List of sounds in soundboard '${bold(matchByTitle.title)}':\n${sounds.join('\n')}`);
    } else {
      await interaction.editReply(`No soundboard with given title or id: ${bold(nameOrId)}`);
    }
  } catch (error) {
		console.error(error);
    await interaction.editReply('Error: Unable to fetch sounds...');
	}
};

export {
  data,
  execute,
};
