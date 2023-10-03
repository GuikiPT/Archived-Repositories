const Discord = require('discord.js');

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};