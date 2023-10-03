const Discord = require('discord.js');

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	async execute(client) {
        console.info('Ready as ' + client.user.tag);
    },
};