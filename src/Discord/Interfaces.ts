/** Response of discord API for registering/updating bot slash-command */
interface UpdateCommandEntry {
  id: string,
  application_id: string,
  version: string,
  default_member_permissions: string | null,
  type: number,
  name: string,
  name_localizations: string | null,
  description: string,
  description_localizations: string | null,
  guild_id: string,
  nsfw: boolean
}

/** Response of discord API for registering/updating bot slash-commands */
type UpdateCommandResponse = Array<UpdateCommandEntry>;

// Export content as module
export {
  type UpdateCommandEntry,
  type UpdateCommandResponse,
};
