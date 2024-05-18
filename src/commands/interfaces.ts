import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, ChatInputCommandInteraction } from 'discord.js';

interface Command {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>,
}

interface KenkuSoundboard {
  id: string,
  title: string,
  background: string,
  sounds: Array<string>,
}

interface KenkuSounds {
  url: string,
  title: string,
  id: string,
  loop: boolean,
  volume: number,
  fadeIn: number,
  fadeOut: number,
}

interface KenkuGetSoundboards {
  soundboards: Array<KenkuSoundboard>,
  sounds: Array<KenkuSounds>,
}

interface KenkuSoundStatus {
  id: string,
  url: string,
  title: string,
  loop: boolean,
  volume: number,
  fadeIn: number,
  fadeOut: number,
  duration: number,
  progress: number,
}

interface KenkuGetSoundState {
  sounds: Array<KenkuSoundStatus>,
}

export {
  type Command,
  type KenkuSoundboard,
  type KenkuSounds,
  type KenkuGetSoundboards,
  type KenkuSoundStatus,
  type KenkuGetSoundState
};
