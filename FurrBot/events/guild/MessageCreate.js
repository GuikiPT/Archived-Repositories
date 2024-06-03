const Discord = require('discord.js');
const colors = require('colors/safe');
const config = require('../../config/config');

module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    /**
     *
     * @param {Discord.Message} message
     */
    async execute(message) {
        try {
            if (message.author.bot) return;

            if (message.mentions.has(message.client.user.id) && message.author.id.includes(config.discordConfig.ownersIds)) {
                await message.react('❤️').catch((error) => {
                    console.error(colors.red(`❌ Error reacting owner message: \n${error.stack || error}`));
                });
            }
        }
        catch (err) {
            console.error(colors.red(err.stack || err));
        }
    },
};