declare module "loggerox" {
  /**
   * Function to initialize configuration for LoggerOx
   * @param {string} idChannelLog The ID of the channel to log events.
   */
  export function initLoggerOx(idChannelLog: string): void;
  /**
   * Function to change embed color depending on event type
   * @param {string} type Type of event | Add (green) / Update (orange) / Delete (red)
   * @param {string} color Color in HEX format.
   */
  export function changeColor(type: string, color: string): void;
  /**
   *  Event when a channel is created
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {boolean} options No more options. Yes = true / No = false
   */
  export function getChannelCreate(
    client: object,
    lang: string,
    options: boolean
  ): void;
  /**
   * Event when a channel is deleted
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {boolean} options No more options. Yes = true / No = false
   */
  export function getChannelDelete(
    client: object,
    lang: string,
    options: boolean
  ): void;
  /**
   * Event when a channel is updated
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {boolean} options No more options. Yes = true / No = false
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getChannelUpdate(
    client: object,
    lang: string,
    options: boolean,
    bot: boolean
  ): void;
  /**
   * Event when a message is pinned or not
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {boolean} options No more options. Yes = true / No = false
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getPinsUpdate(
    client: object,
    lang: string,
    options: boolean,
    bot: boolean
  ): void;
  /**
   * Debug event
   * @param {object} client Client Recover from Discord
   * @param {object} active Yes = true / No = false
   */
  export function getDebug(client: object, active: object): void;
  /**
   * Event when an emoji is created
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getEmojiCreate(client: object, lang: string): void;
  /**
   * Event when an emoji is deleted
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getEmojiDelete(client: object, lang: string): void;
  /**
   * Event when an emoji is updated
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getEmojiUpdate(
    client: object,
    lang: string,
    bot: boolean
  ): void;
  /**
   * Event when there is a ban
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getBanAdd(client: object, lang: string): void;
  /**
   *Event when there is a ban removed
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getBanRemove(client: object, lang: string): void;
  /**
   * Event when it is the creation of an event
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getScheduledCreate(client: object, lang: string): void;
  /**
   * Event when it is the delete of an event
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getScheduledDelete(client: object, lang: string): void;
  /**
   * Event when it is the update of an event
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getScheduledUpdate(
    client: object,
    lang: string,
    bot: boolean
  ): void;
  /**
   * Event when a user subscribes to an event
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getScheduledUserAdd(client: object, lang: string): void;
  /**
   * Event when a user remove subscribes to an event
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getScheduledUserRemove(client: object, lang: string): void;
  /**
   * Event when a guild update
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getGuildUpdate(client: object, lang: string): void;
  /**
   * Event when a member undergoes a change
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getGuildMemberUpdate(client: object, lang: string): void;
  /**
   * Event when the server becomes unavailable, probably due to a server outage.
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getGuildUnavailable(client: object, lang: string): void;
  /**
   * Event when a user joins the server.
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getGuildMemberAdd(client: object, lang: string): void;
  /**
   * Event when a user leaves the server.
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getGuildMemberRemove(client: object, lang: string): void;
  /**
   * Event when a user creates an invitation
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getInviteCreate(client: object, lang: string): void;
  /**
   * Event when a user delete an invitation
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getInviteDelete(client: object, lang: string): void;
  /**
   * Event when a user update an message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageUpdate(client: object, lang: string): void;
  /**
   * Event when a user delete an message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageDelete(client: object, lang: string): void;
  /**
   * Event when a user deletes messages in bulk
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageDeleteBulk(client: object, lang: string): void;
  /**
   * Event when a user adds a reaction to a message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageReactionUser(client: object, lang: string): void;
  /**
   * Event when a user removed a reaction to a message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageReactionUserRemove(
    client: object,
    lang: string
  ): void;
  /**
   * Event when a user removed all reaction to a message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageReactionUserRemoveAll(
    client: object,
    lang: string
  ): void;
  /**
   * Event when a user deletes an explicitly deleted emoji from a message
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getMessageReactionUserGroupRemove(
    client: object,
    lang: string
  ): void;
  /**
   * Event when a user creates a role
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getRoleCreate(client: object, lang: string): void;
  /**
   * Event when a user delete a role
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getRoleDelete(client: object, lang: string): void;
  /**
   * Event when a user update a role
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getRoleUpdate(
    client: object,
    lang: string,
    bot: boolean
  ): void;
  /**
   * Event when a user creates a sticker
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getStickerCreate(client: object, lang: string): void;
  /**
   * Event when a user delete a sticker
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getStickerDelete(client: object, lang: string): void;
  /**
   * Event when a user update a sticker
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getStickerUpdate(
    client: object,
    lang: string,
    bot: boolean
  ): void;
  /**
   * Event when a user create a thread
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getThreadCreate(client: object, lang: string): void;
  /**
   * Event when a user delete a thread
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getThreadDelete(client: object, lang: string): void;
  /**
   * Event when a user update a thread
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   * @param {options} bot Have events created by bots. True: true / False: false
   */
  export function getThreadUpdate(
    client: object,
    lang: string,
    bot: boolean
  ): void;
  /**
   * Event when a user is added or removed from a thread.
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getThreadMembersUpdate(client: object, lang: string): void;
  /**
   * Event when a user update a profile
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getUserUpdate(client: object, lang: string): void;
  /**
   * Event when a user update in vocal
   * @param {object} client Client Recover from Discord
   * @param {string} lang Language chosen by the person | fr/en
   */
  export function getVoiceStateUpdate(client: object, lang: string): void;
}
