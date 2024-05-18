import { SlashCommandBuilder, ChatInputCommandInteraction, bold, italic } from 'discord.js';
import ky from 'ky';

import { KenkuGetSoundState } from './interfaces.js';
import * as config from '../../config.json' assert { type: "json" };

const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Show current soundboard playback status.')
  .setDMPermission(false);

const execute = async (interaction: ChatInputCommandInteraction) => {
  await interaction.deferReply();

  try {
    const json: KenkuGetSoundState = await ky.get(`${config.default.url}/v1/soundboard/playback`).json();
    if (json.sounds.length === 0) {
      await interaction.editReply(`Currently playing nothing`);
    } else if (json.sounds.length === 1) {
      const sounds = json.sounds.map((sound) => { return `${bold(sound.id)}: '${italic(sound.title)}' | ${Math.round(sound.progress)} / ${sound.duration}s ${(sound.loop ? '(looping)' : '')}` });
      await interaction.editReply(`Currently playing following sound: ${sounds[0]}`);
    } else {
      const sounds = json.sounds.map((sound) => { return `- ${bold(sound.id)}: '${italic(sound.title)}' | ${Math.round(sound.progress)} / ${sound.duration}s ${(sound.loop ? '(looping)' : '')}` });
      await interaction.editReply(`Currently playing following sounds:\n${sounds.join('\n')}`);
    }
  } catch (error) {
		console.error(error);
    await interaction.editReply(`Error: Unable to fetch sound playback state...`);
	}
};

export {
  data,
  execute,
};
