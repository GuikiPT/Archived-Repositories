const Discord = require('discord.js');

module.exports = {
	name: Discord.Events.InteractionCreate,
	once: false,
	async execute(client, interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(error.stack);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'Foi encontrado um erro ao executar este comando!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'Foi encontrado um erro ao executar este comando!', ephemeral: true });
			}
		}
	},
};