/** Content of a Soundboard entry as returned by KenkuFM remote-control API */
interface KenkuSoundboard {
  id: string,
  title: string,
  background: string,
  sounds: string[],
}

/** Content of a Soundboard > Sound entry as returned by KenkuFM remote-control API */
interface KenkuSounds {
  url: string,
  title: string,
  id: string,
  loop: boolean,
  volume: number,
  fadeIn: number,
  fadeOut: number,
}

/** Content of a Get:/Soundboard KenkuFM remote-control API response */
interface KenkuGetSoundboards {
  soundboards: KenkuSoundboard[],
  sounds: KenkuSounds[],
}

/** Content of a Soundboard-State > Sound entry as returned by KenkuFM remote-control API */
interface KenkuSoundState {
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

/** Content of a Get:/Soundboard/Playback KenkuFM remote-control API response */
interface KenkuGetSoundState {
  sounds: KenkuSoundState[],
}

/** Content of a Playlist entry as returned by KenkuFM remote-control API */
interface KenkuPlaylist {
  id: string,
  tracks: string[],
  background: string,
  title: string,
}

/** Content of a Playlist > Track entry as returned by KenkuFM remote-control API */
interface KenkuTracks {
  id: string,
  url: string,
  title: string,
}

/** Content of a Get:/Playlist KenkuFM remote-control API response */
interface KenkuGetPlaylists {
  playlists: KenkuPlaylist[],
  tracks: KenkuTracks[],
}

/** Content of a State > Track entry as returned by KenkuFM remote-control API */
interface KenkuTrackState {
  url: string,
  title: string,
  id: string,
  duration: number,
  progress: number,
}

/** Content of a State > Playlist entry as returned by KenkuFM remote-control API */
interface KenkuPlaylistState {
  id: string,
  title: string,
}

/** Content of a Get:/Playlist/Playback KenkuFM remote-control API response */
interface KenkuGetTrackState {
  playing: boolean,
  volume: number,
  muted: boolean,
  shuffle: boolean,
  repeat: string,
  track?: KenkuTrackState,
  playlist?: KenkuPlaylistState
}

/** Content of a Put:/Soundboard/Play or Put:/Soundboard/Stop KenkuFM remote-control API response */
interface KenkuId {
  id: string,
}

// Export content as module
export {
  type KenkuSoundboard,
  type KenkuSounds,
  type KenkuGetSoundboards,
  type KenkuSoundState,
  type KenkuGetSoundState,
  type KenkuPlaylist,
  type KenkuTracks,
  type KenkuGetPlaylists,
  type KenkuTrackState,
  type KenkuPlaylistState,
  type KenkuGetTrackState,
  type KenkuId,
};
