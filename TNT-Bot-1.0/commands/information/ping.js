const Discord = require('discord.js');

module.exports = {
	data: new Discord.SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping atual do bot.'),
	async execute(client, interaction) {
		try {
			const loadingInteraction = await interaction.reply({ content: '<a:DiscordLoading:1035119091662454836>',  fetchReply: true });
	
			const roundtripPing = loadingInteraction.createdTimestamp - interaction.createdTimestamp;
	
			const pingEmbed = new Discord.EmbedBuilder()
				.setTitle('🏓 | Pong!')
				.setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 2048 }))
				.addFields(
					{ name: '**Bot Ping**', value: '```ini\n [ ' + roundtripPing + 'ms ] \n```', inline: true },
					{ name: '**Discord API Ping**', value: '```ini\n [ ' + client.ws.ping + 'ms ] \n```', inline: true },
				)
				.setTimestamp()
			return interaction.editReply({ content: '', embeds: [pingEmbed] });
		}
		catch(error) {
			console.error(error.stack);
		}
	},
};