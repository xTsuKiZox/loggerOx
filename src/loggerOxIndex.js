//#region CONSTRUCTOR
const {
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    AuditLogEvent
} = require('discord.js');
const langLO = require('./langs.json');
const fs = require("fs");
const path = require("path");
//#endregion CONSTRUCTOR

//#region INIT
/**
 * Function to initialize configuration for LoggerOx
 * @param {string} idChannelLog The ID of the channel to log events.
 */
function initLoggerOx(idChannelLog) {
    if (!idChannelLog) {
        throw new Error(
            "The `idChannelLog` parameter are required in the initLoggerOx function call"
        );
    }
    const defaultColors = {
        success: "#57F287",
        error: "#ED4245",
        warning: "#F1C40F",
    };

    const configPath = path.join(__dirname, "config.json");

    let configData = {
        message: {
            idChannelLog,
        },
        color: defaultColors,
    };

    if (fs.existsSync(configPath)) {
        try {
            const existingConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

            configData.message = {
                idChannelLog: idChannelLog || existingConfig.message.idChannelLog,
            };

            configData.color = existingConfig.color || defaultColors;
        } catch (err) {
            console.error(
                "An error occurred while reading the existing configuration file:",
                err
            );
            throw err;
        }
    }

    try {
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4), "utf8");
        console.log(`Configuration saved successfully via initLoggerOx !`);
    } catch (err) {
        console.error(
            "An error occurred while creating or updating the configuration file:",
            err
        );
        throw err;
    }
}
//#endregion INIT

//#region VERIFHEXCOLOR
/**
 * Function to validate if a string is a valid HEX color.
 * @param {string} color - The string to validate as a HEX color.
 * @returns {boolean} - Returns true if the string is a valid HEX color, otherwise false.
 */
function isValidHexColor(color) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return hexColorRegex.test(color);
}
//#endregion VERIFHEXCOLOR

//#region CHANGECOLOR
/**
 * Function to change embed color depending on event type
 * @param {string} type Type of event | Add (green) / Update (orange) / Delete (red)
 * @param {string} color Color in HEX format.
 */
function changeColor(type, color) {
    if (!type || !color) {
        throw new Error(
            "Both `type` and `color` parameters are required to change the color."
        );
    }

    if (!isValidHexColor(color)) {
        throw new Error("The `color` must be a valid HEX color.");
    }

    const defaultColors = {
        success: "#57F287",  // Green
        error: "#ED4245",    // Red
        warning: "#F1C40F",  // Orange
    };

    const colors = { ...defaultColors };
    if (type === "Add") {
        colors.success = color;
    } else if (type === "Update") {
        colors.warning = color;
    } else if (type === "Delete") {
        colors.error = color;
    } else {
        throw new Error("Invalid `type` parameter. Valid values are: 'Add', 'Update', 'Delete'.");
    }

    const configPath = path.join(__dirname, "config.json");

    let configData = {
        color: colors,
    };

    if (fs.existsSync(configPath)) {
        try {
            const existingConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));

            configData.message = existingConfig.message || {};
            configData.color = {
                ...existingConfig.color,
                ...colors,
            };
        } catch (err) {
            console.error(
                "An error occurred while reading the existing configuration file:",
                err
            );
            throw err;
        }
    } else {
        configData.message = {
            idChannelLog: "",
        };
    }

    try {
        fs.writeFileSync(configPath, JSON.stringify(configData, null, 4), "utf8");
        console.log(`Configuration updated successfully with new color for type: ${type}`);
    } catch (err) {
        console.error(
            "An error occurred while updating the configuration file:",
            err
        );
        throw err;
    }
}
//#endregion CHANGECOLOR

//#region VERIFCONFIG
/**
 * Function to verify the existence of the config file and the `idChannelLog` key
 * @returns {string} The value of `idChannelLog` if it exists
 * @throws {Error} If the config file or the `idChannelLog` key is missing
 */
function verifyConfig() {
    const configPath = path.join(__dirname, "config.json");

    if (!fs.existsSync(configPath)) {
        throw new Error(
            "The configuration file `config.json` is missing. Please initialize it first."
        );
    }

    let configData;
    try {
        configData = JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (err) {
        throw new Error(
            "An error occurred while reading or parsing the configuration file."
        );
    }

    if (!configData.message || !configData.message.idChannelLog) {
        throw new Error(
            "The key `idChannelLog` is missing in the configuration file. Please update the configuration."
        );
    }

    return configData;
}
//#endregion VERIFCONFIG

//#region DEBUG
/**
 * Debug function to make life easier when testing, creation of the founder of LoggerOx
 * @param {object} debug1 First object retrieved for debug
 * @param {object} debug2 Second object retrieved for debug
*/
function debugFunction(debug1, debug2) {
    if (debug1 && !debug2) {
        console.log(debug1)
    } else if (debug1 && debug2) {
        console.log(debug1)
        console.log("---------------------------")
        console.log(debug2)
        console.log("---------------------------")
    }
}
//#endregion DEBUG

//#region ISIMAGEURL
/**
 * Checks if a URL points to an image.
 * @param {string} url The URL to check.
 * @param {int} getPresence Presence = 0: no | 1: yes
 * @returns {String<string>} Returns the URL, otherwise nothing.
 * @returns {Promise<boolean>} Returns true if the URL points to an image, false otherwise.
*/
async function isImageUrl(url, getPresence) {
    switch (getPresence) {
        case 0:
            try {
                const response = await fetch(url, { method: 'HEAD' });
                return response.ok && response.headers.get("content-type").startsWith("image") ? url : null;
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'URL dans verifImgIcon ligne 1108 :', error);
                return false;
            }
            break;

        case 1:
            return fetch(url, { method: 'HEAD' })
                .then(response => {
                    return response.ok && response.headers.get("content-type").startsWith("image") ? url : null;
                })
                .catch(error => {
                    console.error("Erreur lors de la vérification de l'URL :", error);
                    return null;
                });
            break;
    }
}
//#endregion ISIMAGEURL

//#region FORMATDURATION
/**
 * Returns the time according to the seconds given by discord, function used for the creator
 * @param {string} seconds Time
 * @param {boolean} format Format type | 0: Sentence / 1: Subject
*/
function formatDuration(seconds, format) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    if (format === 0) {
        return `${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${remainingSeconds} second(s)`;
    } else {
        return {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: remainingSeconds
        }
    }
}
//#endregion FORMATDURATION

//#region VERIFIMGICON
/**
 * Uses client information to retrieve the icon if it is WEBP or GIF
 * @param {string} id Id retrieved by Discord client
 * @param {string} icon Icon retrieved by Discord client
*/
async function verifImgIcon(id, icon) {
    const iconUrlF = `https://cdn.discordapp.com/icons/${id}/${icon}.webp?size=512`;
    const iconUrlG = `https://cdn.discordapp.com/icons/${id}/${icon}.gif?size=512`;
    const iconServ = await isImageUrl(iconUrlG, 1) || await isImageUrl(iconUrlF, 1);

    return iconServ
}
//#endregion VERIFIMGICON

//#region VERIFIMGAVATAR
/**
 * Uses client information to retrieve the avatar if it is WEBP or GIF
 * @param {string} id Id retrieved by Discord client
 * @param {string} avatar Avatar retrieved by Discord client
*/
async function verifImgAvatar(id, avatar) {
    const avatarUrlGif = `https://cdn.discordapp.com/avatars/${id}/${avatar}.gif?size=512`;
    const avatarUrlWebp = `https://cdn.discordapp.com/avatars/${id}/${avatar}.webp?size=512`;
    const newAvatar = await isImageUrl(avatarUrlGif, 0) || await isImageUrl(avatarUrlWebp, 0);

    return newAvatar
}
//#endregion VERIFIMGAVATAR

//#region CHANNELCREATE
/**
 *  Event when a channel is created
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
 * @param {boolean} options No more options. Yes = true / No = false
*/
function getChannelCreate(client, lang, options) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].channelcreate) {
                client.on("channelCreate", async (channel) => {
                    const auditLogs = await channel.guild.fetchAuditLogs({
                        type: AuditLogEvent.ChannelCreate,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].channelcreate[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: channel.guild.name, iconURL: await verifImgIcon(channel.guild.id, channel.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[0], value: `<#${channel.id}>`, inline: true },
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (options === true) {
                            if (channel.nsfw === false) {
                                forNsfw = langLO[lang].tools[2]
                            } else if (channel.nsfw === true) {
                                forNsfw = langLO[lang].tools[3]
                            }
                            embed.addFields(
                                {
                                    name: "NSFW ?",
                                    value: forNsfw,
                                    inline: true
                                }
                                ,
                                {
                                    name: langLO[lang].tools[4],
                                    value: `<#${channel.parentId}>`,
                                    inline: true
                                }
                            )
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                channel.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "ChannelCreate !")
            }
        }
    } catch (error) {
        console.log("Error in channel create :", error);
    }
}
//#endregion CHANNELCREATE

//#region CHANNELDELETE
/**
 * Event when a channel is deleted
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
 * @param {boolean} options No more options. True: Yes / False: No
*/
function getChannelDelete(client, lang, options) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].channeldelete) {
                client.on("channelDelete", async (channel) => {
                    const auditLogs = await channel.guild.fetchAuditLogs({
                        type: AuditLogEvent.ChannelDelete,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].channeldelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: channel.guild.name, iconURL: await verifImgIcon(channel.guild.id, channel.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[0], value: `${channel.name}`, inline: true },
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (options === true) {
                            if (channel.nsfw === false) {
                                forNsfw = langLO[lang].tools[2]
                            } else if (channel.nsfw === true) {
                                forNsfw = langLO[lang].tools[3]
                            }
                            embed.addFields(
                                {
                                    name: "NSFW ?",
                                    value: forNsfw,
                                    inline: true
                                }
                                ,
                                {
                                    name: langLO[lang].tools[4],
                                    value: `<#${channel.parentId}>`,
                                    inline: true
                                }
                            )
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                channel.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "ChannelDelete !")
            }
        }
    } catch (error) {
        console.log("Error in channel delete :", error);
    }
}
//#endregion CHANNELDELETE

//#region CHANNELUPDATE
/**
 * Event when a channel is updated
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
 * @param {boolean} options No more options. True: Yes / False: No
*/
function getChannelUpdate(client, lang, options) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].channelupdate) {
                client.on("channelUpdate", async (oldChannel, newChannel) => {
                    const auditLogs = await newChannel.guild.fetchAuditLogs({
                        type: AuditLogEvent.ChannelUpdate,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        if (oldChannel.name != newChannel.name) {
                            try {
                                const embed = new EmbedBuilder()
                                    .setTitle(langLO[lang].channelupdate[0])
                                    .setColor(serverConfig.color.warning)
                                    .setDescription(`**${oldChannel.name}** → **${newChannel.name}**`)
                                    .setThumbnail(user.avatarURL())
                                    .setAuthor({ name: newChannel.guild.name, iconURL: await verifImgIcon(newChannel.guild.id, newChannel.guild.icon) })
                                    .addFields(
                                        { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                                if (options === true) {
                                    if (channel.nsfw === false) {
                                        forNsfw = langLO[lang].tools[2]
                                    } else if (channel.nsfw === true) {
                                        forNsfw = langLO[lang].tools[3]
                                    }
                                    embed.addFields(
                                        {
                                            name: "NSFW ?",
                                            value: forNsfw,
                                            inline: true
                                        }
                                        ,
                                        {
                                            name: langLO[lang].tools[4],
                                            value: `<#${newChannel.parentId}>`,
                                            inline: true
                                        }
                                    )
                                }

                                if (serverConfig.message.idChannelLog) {
                                    try {
                                        newChannel.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                                    } catch (error) {
                                        console.error(langLO[lang].error[1]);
                                    }
                                }
                            } catch (error) {
                                console.log("Error changing channel name, not topic: ", error)
                            }
                        } else if (oldChannel.topic != newChannel.topic) {
                            try {
                                if (oldChannel.topic === "") { return oldChannel.topic = " " }
                                if (newChannel.topic === "") { return newChannel.topic = " " }
                                const embed = new EmbedBuilder()
                                    .setTitle(langLO[lang].channelupdate[1])
                                    .setColor(serverConfig.color.warning)
                                    .setDescription(`**${oldChannel.topic}** → **${newChannel.topic}**`)
                                    .setThumbnail(user.avatarURL())
                                    .setAuthor({ name: newChannel.guild.name, iconURL: await verifImgIcon(newChannel.guild.id, newChannel.guild.icon) })
                                    .addFields(
                                        { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                                    )
                                    .setTimestamp()
                                    .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                                if (options === true) {
                                    if (newChannel.nsfw === false) {
                                        forNsfw = langLO[lang].tools[2]
                                    } else if (newChannel.nsfw === true) {
                                        forNsfw = langLO[lang].tools[3]
                                    }
                                    embed.addFields(
                                        {
                                            name: "NSFW ?",
                                            value: forNsfw,
                                            inline: true
                                        }
                                        ,
                                        {
                                            name: langLO[lang].tools[4],
                                            value: `<#${newChannel.parentId}>`,
                                            inline: true
                                        }
                                    )
                                }

                                if (serverConfig.message.idChannelLog) {
                                    try {
                                        newChannel.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                                    } catch (error) {
                                        console.error(langLO[lang].error[1]);
                                    }
                                }
                            } catch (error) {
                                console.log("Error changing topic: ", error)
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "ChannelUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in channel update", error);
    }
}
//#endregion CHANNELUPDATE

//#region CHANNELPINSUPDATE
/**
 * Event when a message is pinned or not
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
 * @param {boolean} options No more options. True: Yes / False: No
*/
function getPinsUpdate(client, lang, options) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].pinsupdate) {
                client.on("channelPinsUpdate", async (channel, time) => {
                    const auditLogs = await channel.guild.fetchAuditLogs({
                        type: AuditLogEvent.MessagePin,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        let title
                        let colorForEmbed

                        if (time != null) {
                            title = langLO[lang].pinsupdate[0]
                            colorForEmbed = serverConfig.color.success
                        } else {
                            title = langLO[lang].pinsupdate[1]
                            colorForEmbed = serverConfig.color.error
                        }

                        const embed = new EmbedBuilder()
                            .setTitle(title)
                            .setColor(colorForEmbed)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: channel.guild.name, iconURL: await verifImgIcon(channel.guild.id, channel.guild.icon) })
                            .addFields(
                                { name: langLO[lang].pinsupdate[2], value: `<#${channel.id}>`, inline: true },
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (options === true) {
                            if (channel.nsfw === false) {
                                forNsfw = langLO[lang].tools[2]
                            } else if (channel.nsfw === true) {
                                forNsfw = langLO[lang].tools[3]
                            }
                            embed.addFields(
                                {
                                    name: "NSFW ?",
                                    value: forNsfw,
                                    inline: true
                                }
                                ,
                                {
                                    name: langLO[lang].tools[4],
                                    value: `<#${channel.parentId}>`,
                                    inline: true
                                }
                            )
                        }

                        if (time != null) {
                            embed.addFields(
                                { name: langLO[lang].pinsupdate[3], value: new Date(time).toLocaleString(), inline: true })
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                channel.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "PinsUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in pins update :", error);
    }
}
//#endregion CHANNELPINSUPDATE

//#region DEBUGDISCORD
/**
 * Debug event
 * @param {object} client Client Recover from Discord
 * @param {object} active True: Yes / False: No
*/
function getDebug(client, active) {
    try {
        if (active === true) {
            client.on("debug", async (info) => {
                console.log(info)
            });
        }
    } catch (error) {
        console.log("Error in debug", error);
    }
}
//#endregion DEBUGDISCORD

//#region EMOJICREATE
/**
 * Event when an emoji is created
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getEmojiCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].emojicreate) {
                client.on("emojiCreate", async (emoji) => {
                    const auditLogs = await emoji.guild.fetchAuditLogs({
                        type: AuditLogEvent.EmojiCreate,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].emojicreate[0])
                            .setColor(serverConfig.color.success)
                            .setDescription(`${langLO[lang].emojicreate[1]} **${emoji.name}** ${langLO[lang].emojicreate[2]}`)
                            .setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
                            .setAuthor({ name: emoji.guild.name, iconURL: await verifImgIcon(emoji.guild.id, emoji.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true },
                                { name: langLO[lang].emojicreate[3], value: `${emoji.id}`, inline: true },
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                emoji.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "EmojiCreate !")
            }
        }
    } catch (error) {
        console.log("Error in emoji create:", error);
    }
}
//#endregion EMOJICREATE

//#region EMOJIDELETE
/**
 * Event when an emoji is deleted
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getEmojiDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].emojidelete) {
                client.on("emojiDelete", async (emoji) => {
                    const auditLogs = await emoji.guild.fetchAuditLogs({
                        type: AuditLogEvent.EmojiDelete,
                        limit: 1
                    });

                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].emojidelete[0])
                            .setColor(serverConfig.color.error)
                            .setDescription(`${langLO[lang].emojidelete[1]} **${emoji.name}** ${langLO[lang].emojidelete[2]}`)
                            .setThumbnail(`https://cdn.discordapp.com/emojis/${emoji.id}.png`)
                            .setAuthor({ name: emoji.guild.name, iconURL: await verifImgIcon(emoji.guild.id, emoji.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true },
                                { name: langLO[lang].emojidelete[3], value: `${emoji.id}`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                emoji.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "EmojiDelete !")
            }
        }
    } catch (error) {
        console.log("Error in emoji delete:", error);
    }
}
//#endregion EMOJIDELETE

//#region EMOJIUPDATE
/**
 * Event when an emoji is updated
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
async function getEmojiUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].emojiupdate) {
                client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
                    const auditLogs = await newEmoji.guild.fetchAuditLogs({
                        type: AuditLogEvent.EmojiUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].emojiupdate[0])
                            .setColor(serverConfig.color.warning)
                            .setDescription(`**${oldEmoji.name}** → **${newEmoji.name}**`)
                            .setThumbnail(`https://cdn.discordapp.com/emojis/${newEmoji.id}.png`)
                            .setAuthor({ name: newEmoji.guild.name, iconURL: await verifImgIcon(newEmoji.guild.id, newEmoji.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true },
                                { name: langLO[lang].emojiupdate[1], value: `${newEmoji.id}`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newEmoji.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "EmojiUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in emoji update :", error);
    }
}
//#endregion EMOJIUPDATE

//#region BANADD
/**
 * Event when there is a ban
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getBanAdd(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].banadd) {
                client.on("guildBanAdd", async (guild) => {
                    const auditLogs = await guild.guild.fetchAuditLogs({
                        type: AuditLogEvent.MemberBanAdd,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const reason = logEntry.reason || langLO[lang].banadd[0];

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].banadd[1])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(await verifImgAvatar(guild.user.id, guild.user.avatar))
                            .setDescription(`<@${guild.user.id}> ${langLO[lang].banadd[2]}`)
                            .setAuthor({ name: guild.guild.name, iconURL: await verifImgIcon(guild.guild.id, guild.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true },
                                { name: langLO[lang].banadd[3], value: reason, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                guild.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }

                    }

                });
            } else {
                console.error(langLO.en.error[0] + "BanAdd !")
            }
        }
    } catch (error) {
        console.log("Error in ban add :", error);
    }
}
//#endregion BANADD

//#region BANREMOVE
/**
 *Event when there is a ban removed
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getBanRemove(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].banremove) {
                client.on("guildBanRemove", async (guild) => {
                    const auditLogs = await guild.guild.fetchAuditLogs({
                        type: AuditLogEvent.MemberBanRemove,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].banremove[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(await verifImgAvatar(guild.user.id, guild.user.avatar))
                            .setDescription(`<@${guild.user.id}> ${langLO[lang].banremove[1]}`)
                            .setAuthor({ name: guild.guild.name, iconURL: await verifImgIcon(guild.guild.id, guild.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: true }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                guild.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }

                    }
                });
            } else {
                console.error(langLO.en.error[0] + "BanRemove !")
            }
        }
    } catch (error) {
        console.log("Error in remove ban :", error);
    }
}
//#endregion BANREMOVE

//#region SCHEDULEDCREATE
/**
 * Event when it is the creation of an event
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getScheduledCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].scheduledcreate) {
                client.on("guildScheduledEventCreate", async (guildScheduledEvent) => {
                    const auditLogs = await guildScheduledEvent.guild.fetchAuditLogs({
                        type: AuditLogEvent.GuildScheduledEventCreate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        let commencement = new Date(guildScheduledEvent.scheduledStartTimestamp).toLocaleString()

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].sheduledcreate[0])
                            .setColor(serverConfig.color.success)
                            .setAuthor({ name: guildScheduledEvent.guild.name, iconURL: await verifImgIcon(guildScheduledEvent.guild.id, guildScheduledEvent.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].sheduledcreate[1], value: guildScheduledEvent.name, inline: true },
                                { name: langLO[lang].sheduledcreate[2], value: guildScheduledEvent.description, inline: true },
                                { name: langLO[lang].sheduledcreate[3], value: `<#${guildScheduledEvent.channelId}>`, inline: false },
                                { name: langLO[lang].sheduledcreate[4], value: commencement, inline: true },

                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (guildScheduledEvent.image) {
                            embed.setThumbnail(`https://cdn.discordapp.com/guild-events/${guildScheduledEvent.id}/${guildScheduledEvent.image}.png`)
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                guildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "SheduledCreate !")
            }
        }
    } catch (error) {
        console.log("Error in sheduled create :", error);
    }
}
//#endregion SCHEDULEDCREATE

//#region SCHEDULEDDELETE
/**
 * Event when it is the delete of an event
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getScheduledDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].scheduleddelete) {
                client.on("guildScheduledEventDelete", async (guildScheduledEvent) => {
                    const auditLogs = await guildScheduledEvent.guild.fetchAuditLogs({
                        type: AuditLogEvent.GuildScheduledEventDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].scheduleddelete[0])
                            .setColor(serverConfig.color.error)
                            .setAuthor({ name: guildScheduledEvent.guild.name, iconURL: await verifImgIcon(guildScheduledEvent.guild.id, guildScheduledEvent.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].scheduleddelete[1], value: guildScheduledEvent.name, inline: true },
                                { name: langLO[lang].scheduleddelete[2], value: guildScheduledEvent.description, inline: true }

                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (guildScheduledEvent.image) {
                            embed.setThumbnail(`https://cdn.discordapp.com/guild-events/${guildScheduledEvent.id}/${guildScheduledEvent.image}.png`)
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                guildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }

                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "SheduledDelete !")
            }
        }
    } catch (error) {
        console.log("Error in sheduled delete :", error);
    }
}
//#endregion SCHEDULEDDELETE

//#region SCHEDULEDUPDATE
/**
 * Event when it is the update of an event
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getScheduledUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].scheduledupdate) {
                client.on("guildScheduledEventUpdate", async (oldGuildScheduledEvent, newGuildScheduledEvent) => {
                    const auditLogs = await newGuildScheduledEvent.guild.fetchAuditLogs({
                        type: AuditLogEvent.GuildScheduledEventUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].scheduledupdate[0])
                            .setColor(serverConfig.color.warning)
                            .setAuthor({ name: newGuildScheduledEvent.guild.name, iconURL: await verifImgIcon(newGuildScheduledEvent.guild.id, newGuildScheduledEvent.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false }

                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                        if (oldGuildScheduledEvent.name != newGuildScheduledEvent.name) {
                            embed.addFields({
                                name: langLO[lang].scheduledupdate[1],
                                value: `**${oldGuildScheduledEvent.name}** → **${newGuildScheduledEvent.name}**`
                            })
                        }

                        if (oldGuildScheduledEvent.description != newGuildScheduledEvent.description) {
                            embed.addFields({
                                name: langLO[lang].scheduledupdate[2],
                                value: `**${oldGuildScheduledEvent.description}** → **${newGuildScheduledEvent.description}**`
                            })
                        }

                        if (oldGuildScheduledEvent.scheduledStartTimestamp != newGuildScheduledEvent.scheduledStartTimestamp) {
                            embed.addFields({
                                name: langLO[lang].scheduledupdate[3],
                                value: `**${new Date(oldGuildScheduledEvent.scheduledStartTimestamp).toLocaleString()}** → **${new Date(newGuildScheduledEvent.scheduledStartTimestamp).toLocaleString()}**`
                            })
                        }

                        if (oldGuildScheduledEvent.scheduledEndTimestamp != newGuildScheduledEvent.scheduledEndTimestamp) {
                            embed.addFields({
                                name: langLO[lang].scheduledupdate[4],
                                value: `**${new Date(oldGuildScheduledEvent.scheduledEndTimestamp).toLocaleString()}** → **${new Date(newGuildScheduledEvent.scheduledEndTimestamp).toLocaleString()}**`
                            })
                        }

                        if (oldGuildScheduledEvent.image != newGuildScheduledEvent.image) {
                            embed.setDescription(langLO[lang].scheduledupdate[5])
                            embed.setThumbnail(`https://cdn.discordapp.com/guild-events/${newGuildScheduledEvent.id}/${newGuildScheduledEvent.image}.png`)
                        }

                        if (oldGuildScheduledEvent.entityMetadata.location != newGuildScheduledEvent.entityMetadata.location) {
                            embed.addFields({
                                name: langLO[lang].scheduledupdate[6],
                                value: `**${oldGuildScheduledEvent.entityMetadata.location}** → **${newGuildScheduledEvent.entityMetadata.location}**`
                            })
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newGuildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
        }
        else {
            console.error(langLO.en.error[0] + "SheduledUpdate !")
        }
    } catch (error) {
        console.log("Error in sheduled update :", error);
    }
}
//#endregion SCHEDULEDUPDATE

//#region SCHEDULEDUSERADD
/**
 * Event when a user subscribes to an event
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getScheduledUserAdd(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].scheduleduseradd) {
                client.on("guildScheduledEventUserAdd", async function (guildScheduledEvent, user) {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].scheduleduseradd[0])
                        .setColor(serverConfig.color.success)
                        .setAuthor({ name: guildScheduledEvent.guild.name, iconURL: await verifImgIcon(guildScheduledEvent.guild.id, guildScheduledEvent.guild.icon) })
                        .addFields(
                            { name: langLO[lang].scheduleduseradd[1], value: `${guildScheduledEvent.name}`, inline: false },
                            { name: langLO[lang].scheduleduseradd[2], value: `<@${user.id}>`, inline: false }
                        )
                        .setThumbnail(user.avatarURL())
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (serverConfig.message.idChannelLog) {
                        try {
                            guildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }

                });
            }
            else {
                console.error(langLO.en.error[0] + "SheduledUserAdd !")
            }
        }
    } catch (error) {
        console.log("Error in sheduled user add :", error);
    }
}
//#endregion SCHEDULEDUSERADD

//#region SCHEDULEDUSERREMOVE
/**
 * Event when a user remove subscribes to an event
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getScheduledUserRemove(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].scheduleduserremove) {
                client.on("guildScheduledEventUserRemove", async (guildScheduledEvent, user) => {
                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].scheduleduserremove[0])
                        .setColor(serverConfig.color.error)
                        .setAuthor({ name: guildScheduledEvent.guild.name, iconURL: await verifImgIcon(guildScheduledEvent.guild.id, guildScheduledEvent.guild.icon) })
                        .addFields(
                            { name: langLO[lang].scheduleduserremove[1], value: `${guildScheduledEvent.name}`, inline: false },
                            { name: langLO[lang].scheduleduserremove[2], value: `<@${user.id}>`, inline: false }
                        )
                        .setThumbnail(user.avatarURL())
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (serverConfig.message.idChannelLog) {
                        try {
                            guildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "SheduledUserRemove !")
            }
        }
    } catch (error) {
        console.log("Error in sheduled user remove :", error);
    }
}
//#endregion SCHEDULEDUSERREMOVE

//#region GUILDUPDATE
/**
 * Event when a guild update
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getGuildUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].guildupdate) {
                client.on("guildUpdate", async (oldGuild, newGuild) => {
                    let descriptionParts = [], preniumBarre, messageNotif, widgetEnable, verificationLevel, filterExplicit;


                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].guildupdate[0])
                        .setColor(serverConfig.color.warning)
                        .setAuthor({ name: newGuild.name, iconURL: await verifImgIcon(newGuild.id, newGuild.icon) })
                        .setTimestamp()

                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (oldGuild.name != newGuild.name) {
                        embed.addFields({ name: langLO[lang].guildupdate[1], value: `**${oldGuild.name}** → **${newGuild.name}**` })
                    }
                    if (oldGuild.icon != newGuild.icon) {
                        descriptionParts.push(langLO[lang].guildupdate[2]);
                        embed.setThumbnail(newGuild.iconURL(({ size: 512 })))
                    }
                    if (oldGuild.afkChannelId != newGuild.afkChannelId) {
                        embed.addFields({ name: langLO[lang].guildupdate[3], value: `<#${newGuild.afkChannelId}>` })
                    }
                    if (oldGuild.afkTimeout != newGuild.afkTimeout) {
                        let duree = formatDuration(newGuild.afkTimeout, 1)
                        embed.addFields({ name: langLO[lang].guildupdate[4], value: `${duree.hours} ${langLO[lang].tools[6]}, ${duree.minutes} ${langLO[lang].tools[7]}, ${duree.seconds}${langLO[lang].tools[8]}` })
                    }
                    if (oldGuild.preniumProgressBarEnabled != newGuild.preniumProgressBarEnabled) {
                        if (newGuild.preniumProgressBarEnabled === false) { preniumBarre = langLO[lang].tools[2] } else { preniumBarre = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].guildupdate[5], value: preniumBarre })
                    }
                    if (oldGuild.systemChannelId != newGuild.systemChannelId) {
                        embed.addFields({ name: langLO[lang].guildupdate[6], value: `<#${newGuild.systemChannelId}>` })
                    }
                    if (oldGuild.defaultMessageNotification != newGuild.defaultMessageNotification) {
                        if (newGuild.defaultMessageNotification === 0) { messageNotif = langLO[lang].guildupdate[8] } else { messageNotif = langLO[lang].guildupdate[9] }
                        embed.addFields({ name: langLO[lang].guildupdate[7], value: messageNotif })
                    }
                    if (oldGuild.banner != newGuild.banner) {
                        descriptionParts.push(langLO[lang].userupdate[10]);
                    }
                    if (oldGuild.widgetEnabled != newGuild.widgetEnabled) {
                        if (newGuild.widgetEnabled === 0) { widgetEnable = langLO[lang].tools[2] } else { widgetEnable = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].guildupdate[11], value: widgetEnable })
                    }
                    if (oldGuild.widgetChannelId != newGuild.widgetChannelId) {
                        embed.addFields({ name: langLO[lang].guildupdate[12], value: `<#${newGuild.widgetChannelId}>` })
                    }
                    if (oldGuild.verificationLevel != newGuild.verificationLevel) {
                        if (newGuild.widgetEnabled === 0) { verificationLevel = langLO[lang].guildupdate[14] } else if (newGuild.widgetEnabled === 1) { verificationLevel = langLO[lang].guildupdate[15] } else if (newGuild.widgetEnabled === 2) { verificationLevel = langLO[lang].guildupdate[16] } else if (newGuild.widgetEnabled === 3) { verificationLevel = langLO[lang].guildupdate[17] } else if (newGuild.widgetEnabled === 4) { verificationLevel = langLO[lang].guildupdate[18] }
                        embed.addFields({ name: langLO[lang].guildupdate[13], value: verificationLevel })
                    }
                    if (oldGuild.explicitContentFilter != newGuild.explicitContentFilter) {
                        if (newGuild.explicitContentFilter === 0) { filterExplicit = langLO[lang].guildupdate[20] } else if (newGuild.widgetEnabled === 1) { filterExplicit = langLO[lang].guildupdate[21] } else if (newGuild.widgetEnabled === 2) { filterExplicit = langLO[lang].guildupdate[22] }
                        embed.addFields({ name: langLO[lang].guildupdate[19], value: filterExplicit })
                    }
                    if (oldGuild.safetyAlertsChannelId != newGuild.safetyAlertsChannelId) {
                        embed.addFields({ name: langLO[lang].guildupdate[23], value: `<#${newGuild.safetyAlertsChannelId}>` })
                    }

                    if (descriptionParts.length > 0) {
                        embed.setDescription(descriptionParts.join(" | "));
                    }

                    if (serverConfig.message.idChannelLog) {
                        try {
                            client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }

                });
            }
            else {
                console.error(langLO.en.error[0] + "GuildUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in guild update :", error);
    }
}
//#endregion GUILDUPDATE

//#region GUILDMEMBERUPDATE
/**
 * Event when a member undergoes a change
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getGuildMemberUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].guildmemberupdate) {
                client.on("guildMemberUpdate", async (oldMember, newMember) => {
                    const auditLogs = await newMember.guild.fetchAuditLogs({
                        type: AuditLogEvent.MemberUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].guildmemberupdate[0])
                            .setThumbnail(await verifImgAvatar(newMember.user.id, newMember.user.avatar))
                            .setAuthor({ name: newMember.guild.name, iconURL: await verifImgIcon(newMember.guild.id, newMember.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                        if (oldMember.nickname !== newMember.nickname) {
                            embed.addFields(
                                { name: langLO[lang].guildmemberupdate[2], value: oldMember.nickname || langLO[lang].guildmemberupdate[1], inline: true },
                                { name: langLO[lang].guildmemberupdate[3], value: newMember.nickname || langLO[lang].guildmemberupdate[1], inline: true }
                            );
                            embed.setColor(serverConfig.color.success);
                        }

                        if (oldMember._roles.length !== newMember._roles.length) {
                            const addedRoles = newMember._roles.filter(role => !oldMember._roles.includes(role));
                            const removedRoles = oldMember._roles.filter(role => !newMember._roles.includes(role));

                            if (addedRoles.length > 0) {
                                embed.addFields({
                                    name: langLO[lang].guildmemberupdate[4],
                                    value: addedRoles.map(roleId => `<@&${roleId}>`).join(", "),
                                    inline: true
                                });
                                embed.setColor(serverConfig.color.success);
                            }
                            else if (removedRoles.length > 0) {
                                embed.addFields({
                                    name: langLO[lang].guildmemberupdate[5],
                                    value: removedRoles.map(roleId => `<@&${roleId}>`).join(", "),
                                    inline: true
                                });
                                embed.setColor(serverConfig.color.error);
                            }
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newMember.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            } else {
                console.error(langLO.en.error[0] + "GuildMemberUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in guild member update :", error);
    }
}
//#endregion GUILDMEMBERUPDATE

//#region GUILDUNAVAILABLE
/**
 * Event when the server becomes unavailable, probably due to a server outage.
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getGuildUnavailable(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].guildunavailable) {
                client.on("guildUnavailable", async (guild) => {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].guildunavailable[0])
                        .setColor(serverConfig.color.error)
                        .setAuthor({ name: guild.guild.name, iconURL: await verifImgIcon(guild.guild.id, guild.guild.icon) })
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (serverConfig.message.idChannelLog) {
                        try {
                            guildScheduledEvent.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "GuildUnavailable !")
            }
        }
    } catch (error) {
        console.log("Error in guild unavailable:", error);
    }
}
//#endregion GUILDUNAVAILABLE

//#region GUILDMEMBERADD
/**
 * Event when a user joins the server.
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getGuildMemberAdd(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].guildmemberadd) {
                client.on("guildMemberAdd", async (member) => {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].guildmemberadd[0])
                        .setColor(serverConfig.color.success)
                        .setThumbnail(member.user.avatarURL())
                        .addFields({
                            name: langLO[lang].guildmemberadd[1],
                            value: `<@${member.user.id}>`
                        })
                        .setAuthor({ name: member.guild.name, iconURL: await verifImgIcon(member.guild.id, member.guild.icon) })
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (serverConfig.message.idChannelLog) {
                        try {
                            member.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "GuildMemberAdd !")
            }
        }
    } catch (error) {
        console.log("Error in guild member add :", error);
    }
}
//#endregion GUILDMEMBERADD

//#region GUILDMEMBERDELETE
/**
 * Event when a user leaves the server.
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getGuildMemberRemove(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].guildmemberremove) {
                client.on("guildMemberRemove", async (member) => {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].guildmemberremove[0])
                        .setColor(serverConfig.color.error)
                        .setThumbnail(member.user.avatarURL())
                        .addFields({
                            name: langLO[lang].guildmemberremove[1],
                            value: `<@${member.user.id}>`
                        })
                        .setAuthor({ name: member.guild.name, iconURL: await verifImgIcon(member.guild.id, member.guild.icon) })
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (serverConfig.message.idChannelLog) {
                        try {
                            member.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "GuildMemberRemove !")
            }
        }
    } catch (error) {
        console.log("Error in guild member delete :", error);
    }
}
//#endregion GUILDMEMBERDELETE

//#region INVITECREATE
/**
 * Event when a user creates an invitation
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getInviteCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].invitecreate) {
                client.on("inviteCreate", async (invite) => {
                    const auditLogs = await invite.guild.fetchAuditLogs({
                        type: AuditLogEvent.InviteCreate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        let duree = formatDuration(invite.maxAge, 1)

                        const temporaire = invite.temporary
                            ? langLO[lang].tools[3]
                            : langLO[lang].tools[2];

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].invitecreate[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: invite.guild.name, iconURL: await verifImgIcon(invite.guild.id, invite.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${invite.inviterId}>`, inline: false },
                                { name: langLO[lang].invitecreate[1], value: `<#${invite.channelId}>`, inline: false },
                                { name: langLO[lang].invitecreate[2], value: `${duree.days} ${langLO[lang].tools[5]}, ${duree.hours} ${langLO[lang].tools[6]}, ${duree.minutes} ${langLO[lang].tools[7]}, ${duree.seconds}${langLO[lang].tools[8]}`, inline: false },
                                { name: langLO[lang].invitecreate[3], value: `https://discord.gg/${invite.code}`, inline: false },
                                { name: langLO[lang].invitecreate[4], value: temporaire, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                        if (serverConfig.message.idChannelLog) {
                            try {
                                invite.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "InviteCreate !")
            }
        }
    } catch (error) {
        console.log("Error in invite create :", error);
    }
}
//#endregion INVITECREATE

//#region INVITEDELETE
/**
 * Event when a user delete an invitation
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getInviteDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].invitedelete) {
                client.on("inviteDelete", async (invite) => {
                    const auditLogs = await invite.guild.fetchAuditLogs({
                        type: AuditLogEvent.InviteDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].invitedelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: invite.guild.name, iconURL: await verifImgIcon(invite.guild.id, invite.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].invitedelete[1], value: `<#${invite.channelId}>`, inline: false },
                                { name: langLO[lang].invitedelete[2], value: `https://discord.gg/${invite.code}`, inline: false },
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                        if (serverConfig.message.idChannelLog) {
                            try {
                                invite.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "InviteDelete !")
            }
        }
    } catch (error) {
        console.log("Error in invite delete :", error);
    }
}
//#endregion INVITEDELETE

//#region MESSAGEUPDATE
/**
 * Event when a user update an message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messageupdate) {
                client.on("messageUpdate", async (oldMessage, newMessage) => {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].messageupdate[0])
                        .setColor(serverConfig.color.warning)
                        .setThumbnail(newMessage.author.avatarURL())
                        .setAuthor({ name: newMessage.guild.name, iconURL: await verifImgIcon(newMessage.guild.id, newMessage.guild.icon) })
                        .addFields(
                            { name: langLO[lang].tools[1], value: `<@${newMessage.author.id}>`, inline: false },
                            { name: langLO[lang].messageupdate[1], value: `https://discord.com/channels/${newMessage.guildId}/${newMessage.channelId}/${newMessage.id}`, inline: false },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                    if (oldMessage.content !== newMessage.content) {
                        embed.addFields({
                            name: langLO[lang].messageupdate[2],
                            value: `**${oldMessage.content}** → **${newMessage.content}**`
                        })
                    }

                    if (serverConfig.message.idChannelLog) {
                        try {
                            newMessage.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in message update :", error);
    }
}
//#endregion MESSAGEUPDATE

//#region MESSAGEDELETE
/**
 * Event when a user delete an message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagedelete) {
                client.on("messageDelete", async (message) => {
                    const auditLogs = await message.guild.fetchAuditLogs({
                        type: AuditLogEvent.MessageDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].messagedelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: message.guild.name, iconURL: await verifImgIcon(message.guild.id, message.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].messagedelete[1], value: `<#${message.channelId}>`, inline: false },
                                { name: langLO[lang].messagedelete[2], value: `\`${message.content}\``, inline: false },
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                message.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }

                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageDelete !")
            }
        }
    } catch (error) {
        console.log("Error in message delete :", error);
    }
}
//#endregion MESSAGEDELETE

//#region MESSAGEDELETEBULK
/**
 * Event when a user deletes messages in bulk
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageDeleteBulk(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagedeletebulk) {
                client.on("messageDeleteBulk", async (message) => {
                    const auditLogs = await message.guild.fetchAuditLogs({
                        type: AuditLogEvent.MessageBulkDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;

                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].messagedeletebulk[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: message.guild.name, iconURL: await verifImgIcon(message.guild.id, message.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].messagedeletebulk[1], value: `<#${message.channelId}>`, inline: false },
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                message.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }

                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageDeleteBulk !")
            }
        }
    } catch (error) {
        console.log("Error in message delete bulk :", error);
    }
}
//#endregion MESSAGEDELETEBULK

//#region MESSAGEREACTIONUSER
/**
 * Event when a user adds a reaction to a message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageReactionUser(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagereactionuser) {
                client.on("messageReactionAdd", async (messageReaction, user) => {
                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].messagereactionuser[0])
                        .setColor(serverConfig.color.success)
                        .setThumbnail(user.avatarURL())
                        .addFields(
                            { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                            { name: langLO[lang].messagereactionuser[1], value: `https://discord.com/channels/${messageReaction.message.guildId}/${messageReaction.message.channelId}/${messageReaction.message.id}`, inline: false },
                            { name: langLO[lang].messagereactionuser[2], value: `<@${messageReaction.message.author.id}>`, inline: false },
                            { name: langLO[lang].messagereactionuser[3], value: messageReaction._emoji.name, inline: false },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (serverConfig.message.idChannelLog) {
                        try {
                            client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageReactionUser !")
            }
        }
    } catch (error) {
        console.log("Error in message reaction user :", error);
    }
}
//#endregion MESSAGEREACTIONUSER

//#region MESSAGEREACTIONUSERREMOVE
/**
 * Event when a user removed a reaction to a message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageReactionUserRemove(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagereactionuserremove) {
                client.on("messageReactionRemove", async (messageReaction, user) => {
                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].messagereactionuserremove[0])
                        .setColor(serverConfig.color.error)
                        .setThumbnail(user.avatarURL())
                        .addFields(
                            { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                            { name: langLO[lang].messagereactionuserremove[1], value: `https://discord.com/channels/${messageReaction.message.guildId}/${messageReaction.message.channelId}/${messageReaction.message.id}`, inline: false },
                            { name: langLO[lang].messagereactionuserremove[2], value: `<@${messageReaction.message.author.id}>`, inline: false },
                            { name: langLO[lang].messagereactionuserremove[3], value: messageReaction._emoji.name, inline: false },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (serverConfig.message.idChannelLog) {
                        try {
                            client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageReactionUserRemove !")
            }
        }
    } catch (error) {
        console.log("Error in message reaction user remove :", error);
    }
}
//#endregion MESSAGEREACTIONUSERREMOVE

//#region MESSAGEREACTIONUSERREMOVEALL
/**
 * Event when a user removed all reaction to a message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageReactionUserRemoveAll(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagereactionuserremoveall) {
                client.on("messageReactionRemoveAll", async (message) => {

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].messagereactionuserremoveall[0])
                        .setColor(serverConfig.color.error)
                        .setAuthor({ name: message.guild.name, iconURL: await verifImgIcon(message.guild.id, message.guild.icon) })
                        .addFields(
                            { name: langLO[lang].messagereactionuserremove[1], value: `https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`, inline: false },
                            { name: langLO[lang].messagereactionuserremove[2], value: `<@${message.author.id}>`, inline: false },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (serverConfig.message.idChannelLog) {
                        try {
                            message.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }

                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageReactionUserRemoveAll !")
            }
        }
    } catch (error) {
        console.log("Error in message reaction user remove all :", error);
    }
}
//#endregion MESSAGEREACTIONUSERREMOVEALL

//#region MESSAGEREACTIONUSERGROUPREMOVE
/**
 * Event when a user deletes an explicitly deleted emoji from a message
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getMessageReactionUserGroupRemove(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].messagereactionusergroupremove) {
                client.on("messageReactionRemoveEmoji", async (reaction) => {
                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].messagereactionusergroupremove[0])
                        .setColor(serverConfig.color.error)
                        .addFields(
                            { name: langLO[lang].messagereactionusergroupremove[1], value: `https://discord.com/channels/${reaction.message.guildId}/${reaction.message.channelId}/${reaction.message.id}`, inline: false },
                            { name: langLO[lang].messagereactionusergroupremove[2], value: `${reaction._emoji.name}`, inline: false },
                        )
                        .setTimestamp()
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (serverConfig.message.idChannelLog) {
                        try {
                            client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }

                });
            }
            else {
                console.error(langLO.en.error[0] + "MessageReactionUserGroupRemove !")
            }
        }
    } catch (error) {
        console.log("Error in message reaction user group remove :", error);
    }
}
//#endregion MESSAGEREACTIONUSERGROUPREMOVE

//#region ROLECREATE
/**
 * Event when a user creates a role
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getRoleCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].rolecreate) {
                client.on("roleCreate", async (role) => {

                    const auditLogs = await role.guild.fetchAuditLogs({
                        type: AuditLogEvent.RoleCreate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].rolecreate[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: role.guild.name, iconURL: await verifImgIcon(role.guild.id, role.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].rolecreate[1], value: `<@&${role.id}>`, inline: false },
                            )

                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                role.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "RoleCreate !")
            }
        }
    } catch (error) {
        console.log("Error in role create :", error);
    }
}
//#endregion ROLECREATE

//#region ROLEDELETE
/**
 * Event when a user delete a role
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getRoleDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].roledelete) {
                client.on("roleDelete", async (role) => {
                    const auditLogs = await role.guild.fetchAuditLogs({
                        type: AuditLogEvent.RoleDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {

                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].roledelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: role.guild.name, iconURL: await verifImgIcon(role.guild.id, role.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].roledelete[1], value: `${role.name}`, inline: false },
                            )

                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                role.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "RoleDelete !")
            }
        }
    } catch (error) {
        console.log("Error in role delete :", error);
    }
}
//#endregion ROLEDELETE

//#region ROLEUPDATE
/**
 * Event when a user update a role
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getRoleUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].roleupdate) {
                client.on("roleUpdate", async (oldRole, newRole) => {
                    const auditLogs = await newRole.guild.fetchAuditLogs({
                        type: AuditLogEvent.RoleUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {

                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].roleupdate[0])
                            .setColor(serverConfig.color.warning)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: newRole.guild.name, iconURL: await verifImgIcon(newRole.guild.id, newRole.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (oldRole.name !== newRole.name) {
                            embed.addFields({
                                name: langLO[lang].roleupdate[1],
                                value: `**${oldRole.name}** → **${newRole.name}**`
                            })
                        }

                        if (oldRole.color !== newRole.color) {
                            embed.addFields({
                                name: langLO[lang].roleupdate[2],
                                value: `**${oldRole.color}** → **${newRole.color}**`
                            })
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newRole.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "RoleUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in role update :", error);
    }
}
//#endregion ROLEUPDATE

//#region STICKERCREATE
/**
 * Event when a user creates a sticker
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getStickerCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].stickercreate) {
                client.on("stickerCreate", async (sticker) => {
                    const auditLogs = await sticker.guild.fetchAuditLogs({
                        type: AuditLogEvent.StickerCreate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].stickercreate[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: sticker.guild.name, iconURL: await verifImgIcon(sticker.guild.id, sticker.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].stickercreate[1], value: sticker.id, inline: false },
                                { name: langLO[lang].stickercreate[2], value: sticker.name, inline: false },
                                { name: langLO[lang].stickercreate[3], value: sticker.description, inline: false },
                                { name: langLO[lang].stickercreate[4], value: sticker.tags, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                sticker.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "StickerCreate !")
            }
        }
    } catch (error) {
        console.log("Error in sticker create :", error);
    }
}
//#endregion STICKERCREATE

//#region STICKERDELETE
/**
 * Event when a user delete a sticker
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getStickerDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].stickerdelete) {
                client.on("stickerDelete", async (sticker) => {
                    const auditLogs = await sticker.guild.fetchAuditLogs({
                        type: AuditLogEvent.StickerDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].stickerdelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: sticker.guild.name, iconURL: await verifImgIcon(sticker.guild.id, sticker.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].stickerdelete[1], value: sticker.id, inline: false },
                                { name: langLO[lang].stickerdelete[2], value: sticker.name, inline: false },
                                { name: langLO[lang].stickerdelete[3], value: sticker.description, inline: false },
                                { name: langLO[lang].stickerdelete[4], value: sticker.tags, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                sticker.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "StickerDelete !")
            }
        }
    } catch (error) {
        console.log("Error in sticker delete :", error);
    }
}
//#endregion STICKERDELETE

//#region STICKERUPDATE
/**
 * Event when a user update a sticker
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getStickerUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].stickerupdate) {
                client.on("stickerUpdate", async (oldSticker, newSticker) => {
                    const auditLogs = await newSticker.guild.fetchAuditLogs({
                        type: AuditLogEvent.StickerUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].stickerupdate[0])
                            .setColor(serverConfig.color.warning)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: newSticker.guild.name, iconURL: await verifImgIcon(newSticker.guild.id, newSticker.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false }
                            )
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (oldSticker.name != newSticker.name) {
                            embed.addFields({
                                name: langLO[lang].stickerupdate[1],
                                value: `**${oldSticker.name}** → **${newSticker.name}**`
                            })
                        }

                        if (oldSticker.description != newSticker.description) {
                            embed.addFields({
                                name: langLO[lang].stickerupdate[2],
                                value: `**${oldSticker.description}** → **${newSticker.description}**`
                            })
                        }

                        if (oldSticker.tags != newSticker.tags) {
                            embed.addFields({
                                name: langLO[lang].stickerupdate[3],
                                value: `**${oldSticker.tags}** → **${newSticker.tags}**`
                            })
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newSticker.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "StickerUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in sticker update :", error);
    }
}
//#endregion STICKERUPDATE

//#region THREADCREATE
/**
 * Event when a user create a thread
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getThreadCreate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].threadcreate) {
                client.on("threadCreate", async (thread, newlyCreated) => {
                    const auditLogs = await thread.guild.fetchAuditLogs({
                        type: AuditLogEvent.ThreadCreate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].threadcreate[0])
                            .setColor(serverConfig.color.success)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: thread.guild.name, iconURL: await verifImgIcon(thread.guild.id, thread.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].threadcreate[1], value: thread.name, inline: false },
                            )

                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                thread.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "ThreadCreate !")
            }
        }
    } catch (error) {
        console.log("Error in thread create :", error);
    }
}
//#endregion THREADCREATE

//#region THREADDELETE
/**
 * Event when a user delete a thread
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getThreadDelete(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].threaddelete) {
                client.on("threadDelete", async (thread) => {
                    const auditLogs = await thread.guild.fetchAuditLogs({
                        type: AuditLogEvent.ThreadDelete,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].threaddelete[0])
                            .setColor(serverConfig.color.error)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: thread.guild.name, iconURL: await verifImgIcon(thread.guild.id, thread.guild.icon) })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].threaddelete[1], value: thread.name, inline: false },
                            )

                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                        if (serverConfig.message.idChannelLog) {
                            try {
                                thread.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "ThreadDelete !")
            }
        }
    } catch (error) {
        console.log("Error in thread delete :", error);
    }
}
//#endregion THREADDELETE

//#region THREADUPDATE
/**
 * Event when a user update a thread
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getThreadUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].threadupdate) {
                client.on("threadUpdate", async (oldThread, newThread) => {
                    const auditLogs = await newThread.guild.fetchAuditLogs({
                        type: AuditLogEvent.ThreadUpdate,
                        limit: 1
                    });
                    const logEntry = auditLogs.entries.first();
                    if (logEntry) {
                        const user = logEntry.executor;
                        const embed = new EmbedBuilder()
                            .setTitle(langLO[lang].threadupdate[0])
                            .setColor(serverConfig.color.warning)
                            .setThumbnail(user.avatarURL())
                            .setAuthor({ name: newThread.guild.name, iconURL: await verifImgIcon(newThread.guild.id, newThread.guild.icon) })
                            .setTimestamp()
                            .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() })
                            .addFields(
                                { name: langLO[lang].tools[1], value: `<@${user.id}>`, inline: false },
                                { name: langLO[lang].threadupdate[1], value: `${newThread.name}`, inline: false },
                            )


                        if (oldThread.name !== newThread.name) {
                            embed.addFields({ name: langLO[lang].threadupdate[2], value: `**${oldThread.name}** → **${newThread.name}**` })
                        }
                        if (oldThread.locked !== newThread.locked) {
                            let valeurVerouillage
                            if (newThread.locked === false) { valeurVerouillage = langLO[lang].tools[2] } else { valeurVerouillage = langLO[lang].tools[3] }
                            embed.addFields({ name: langLO[lang].threadupdate[3], value: `${valeurVerouillage}` })
                        }
                        if (oldThread.archived !== newThread.archived) {
                            let valeurArchivage
                            if (newThread.archived === false) { valeurArchivage = langLO[lang].tools[2] } else { valeurArchivage = langLO[lang].tools[3] }
                            embed.addFields({ name: langLO[lang].threadupdate[4], value: `${valeurArchivage}` })
                        }
                        if (oldThread.rateLimitPerUser !== newThread.rateLimitPerUser) {
                            embed.addFields({ name: langLO[lang].threadupdate[5], value: `${newThread.rateLimitPerUser}` })
                        }
                        if (oldThread.archiveTimestamp !== newThread.archiveTimestamp) {
                            let duree = formatDuration(newThread.archiveTimestamp, 1)
                            embed.addFields({ name: langLO[lang].threadupdate[6], value: `${duree.days} ${langLO[lang].tools[5]}, ${duree.hours} ${langLO[lang].tools[6]}, ${duree.minutes} ${langLO[lang].tools[7]}, ${duree.seconds}${langLO[lang].tools[8]}` })
                        }

                        if (serverConfig.message.idChannelLog) {
                            try {
                                newThread.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                            } catch (error) {
                                console.error(langLO[lang].error[1]);
                            }
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "ThreadUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in thread update :", error);
    }
}
//#endregion THREADUPDATE

//#region THREADMEMBESUPDATE
/**
 * Event when a user is added or removed from a thread.
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getThreadMembersUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].threadmembersupdate) {
                client.on("threadMembersUpdate", async (oldMembers, newMembers) => {

                    //! Event when a member joins a thread
                    if (oldMembers && oldMembers.size != 0) {
                        oldMembers.forEach((member, memberId) => {
                            const embed = new EmbedBuilder()
                                .setTitle(langLO[lang].threadmembersupdate[0])
                                .setColor(serverConfig.color.success)
                                .addFields(
                                    { name: langLO[lang].threadmembersupdate[2], value: `<@${memberId}>`, inline: false },
                                    { name: langLO[lang].threadmembersupdate[3], value: member.thread.name, inline: false },
                                )
                                .setTimestamp()
                                .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });


                            if (serverConfig.message.idChannelLog) {
                                try {
                                    client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                                } catch (error) {
                                    console.error(langLO[lang].error[1]);
                                }
                            }
                        });
                    }
                    //! Event when a member leave a thread
                    else if (newMembers && newMembers.size != 0) {
                        newMembers.forEach((member, memberId) => {
                            const embed = new EmbedBuilder()
                                .setTitle(langLO[lang].threadmembersupdate[1])
                                .setColor(serverConfig.color.error)
                                .addFields(
                                    { name: langLO[lang].threadmembersupdate[2], value: `<@${memberId}>`, inline: false },
                                    { name: langLO[lang].threadmembersupdate[3], value: member.thread.name, inline: false },
                                )
                                .setTimestamp()
                                .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                            if (serverConfig.message.idChannelLog) {
                                try {
                                    client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                                } catch (error) {
                                    console.error(langLO[lang].error[1]);
                                }
                            }
                        });
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "ThreadMembersUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in thread members update :", error);
    }
}
//#endregion THREADMEMBESUPDATE

//#region USERUPDATE
/**
 * Event when a user update a profile
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getUserUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].userupdate) {
                client.on("userUpdate", async (oldUser, newUser) => {
                    let descriptionParts = [];

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].userupdate[0])
                        .setColor(serverConfig.color.warning)
                        .setTimestamp()
                        .addFields({
                            name: langLO[lang].userupdate[1],
                            value: `<@${newUser.id}>`,
                        })
                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (oldUser.username != newUser.username) {
                        embed.addFields({ name: langLO[lang].userupdate[2], value: `**${oldUser.username}** → **${newUser.username}**` })
                    }
                    if (oldUser.globalName != newUser.globalName) {
                        embed.addFields({ name: langLO[lang].userupdate[3], value: `**${oldUser.globalName}** → **${newUser.globalName}**` })
                    }
                    if (oldUser.avatar != newUser.avatar) {
                        descriptionParts.push(langLO[lang].userupdate[4]);
                        embed.setThumbnail(newUser.avatarURL())
                    }

                    if (oldUser.banner != newUser.banner) {
                        const format = newUser.banner.startsWith("a_") ? ".gif" : ".png"
                        descriptionParts.push(langLO[lang].userupdate[5]);
                        embed.setImage(`https://cdn.discordapp.com/banners/${newUser.id}/${newUser.banner}${format}?size=4096`)
                    }

                    if (descriptionParts.length > 0) {
                        embed.setDescription(descriptionParts.join(" | "));
                    }

                    if (serverConfig.message.idChannelLog) {
                        try {
                            client.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "UserUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in user update :", error);
    }
}
//#endregion USERUPDATE

//#region VOICESTATEUPDATE
/**
 * Event when a user update in vocal
 * @param {object} client Client Recover from Discord
 * @param {string} lang Language chosen by the person | fr/en
*/
function getVoiceStateUpdate(client, lang) {
    try {
        if (verifyConfig()) {
            let serverConfig = verifyConfig()
            if (langLO[lang] && langLO[lang].voicestateupdate) {
                client.on("voiceStateUpdate", async (oldMember, newMember) => {
                    let etat, automuetSolo, sourdineSolo, automuetServeur, sourdineServeur, partage

                    if (newMember.channelId != null) {
                        etat = langLO[lang].voicestateupdate[1]
                    } else {
                        etat = langLO[lang].voicestateupdate[2]
                    }

                    const embed = new EmbedBuilder()
                        .setTitle(langLO[lang].voicestateupdate[0] + " " + etat)
                        .setColor(serverConfig.color.warning)
                        .setAuthor({ name: newMember.guild.name, iconURL: await verifImgIcon(newMember.guild.id, newMember.guild.icon) })
                        .setTimestamp()
                        .addFields({
                            name: langLO[lang].voicestateupdate[3],
                            value: `<@${newMember.id}>`,
                        })

                        .setFooter({ text: `${client.user.username}`, iconURL: client.user.avatarURL() });

                    if (newMember.channelId != null) {
                        embed.addFields({
                            name: langLO[lang].voicestateupdate[4],
                            value: `<#${newMember.channelId}>`
                        })
                    }

                    if (oldMember.selfMute != newMember.selfMute) {
                        if (newMember.selfMute === false) { automuetSolo = langLO[lang].tools[2] } else { automuetSolo = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].voicestateupdate[5], value: automuetSolo })
                    }
                    if (oldMember.selfDeaf != newMember.selfDeaf) {
                        if (newMember.selfDeaf === false) { sourdineSolo = langLO[lang].tools[2] } else { sourdineSolo = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].voicestateupdate[6], value: sourdineSolo })
                    }
                    if (oldMember.serverMute != newMember.serverMute) {
                        if (newMember.serverMute === false) { automuetServeur = langLO[lang].tools[2] } else { automuetServeur = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].voicestateupdate[7], value: automuetServeur })
                    }
                    if (oldMember.serverDeaf != newMember.serverDeaf) {
                        if (newMember.serverDeaf === false) { sourdineServeur = langLO[lang].tools[2] } else { sourdineServeur = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].voicestateupdate[8], value: sourdineServeur })
                    }
                    if (oldMember.streaming != newMember.streaming) {
                        if (newMember.streaming === false) { partage = langLO[lang].tools[2] } else { partage = langLO[lang].tools[3] }
                        embed.addFields({ name: langLO[lang].voicestateupdate[9], value: partage })
                    }

                    if (serverConfig.message.idChannelLog) {
                        try {
                            newMember.guild.channels.cache.find(ch => ch.id === serverConfig.message.idChannelLog).send({ embeds: [embed] });
                        } catch (error) {
                            console.error(langLO[lang].error[1]);
                        }
                    }
                });
            }
            else {
                console.error(langLO.en.error[0] + "VoiceStateUpdate !")
            }
        }
    } catch (error) {
        console.log("Error in voice state update :", error);
    }
}
//#endregion VOICESTATEUPDATE

//#region EXPORT
module.exports = { initLoggerOx, changeColor, getChannelCreate, getChannelDelete, getPinsUpdate, getChannelUpdate, getDebug, getEmojiCreate, getEmojiDelete, getEmojiUpdate, getBanAdd, getBanRemove, getScheduledCreate, getScheduledDelete, getScheduledUpdate, getScheduledUserAdd, getGuildUpdate, getGuildMemberUpdate, getGuildUnavailable, getGuildMemberAdd, getGuildMemberRemove, getScheduledUserRemove, getInviteCreate, getInviteDelete, getMessageUpdate, getMessageDelete, getMessageDeleteBulk, getMessageReactionUser, getMessageReactionUserRemove, getMessageReactionUserRemoveAll, getMessageReactionUserGroupRemove, getRoleCreate, getRoleDelete, getRoleUpdate, getStickerCreate, getStickerDelete, getStickerUpdate, getThreadCreate, getThreadDelete, getThreadUpdate, getThreadMembersUpdate, getUserUpdate, getVoiceStateUpdate }
//#endregion EXPORT