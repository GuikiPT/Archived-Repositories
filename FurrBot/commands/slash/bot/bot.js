const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('bot')
        .setDescription('Information Command List')
        .addSubcommand(subcommand =>
            subcommand
                .setName('ping')
                .setDescription('Info about bot latency'),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('author')
                .setDescription('Display the bot author information'),
        ),
    /**
	 *
	 * @param {Discord.Interaction} interaction
	 */
    async execute(interaction) {
        try {
            const subCommandName = await interaction.options.getSubcommand();

            if (!subCommandName) {
                return interaction.reply('No subcommand has been provided.');
            }

            switch (subCommandName) {
                case 'ping':
                    require('./subcommands/ping')(interaction);
                    break;
                case 'author':
                    require('./subcommands/author')(interaction);
                    break;
            }
        }
        catch (err) {
            console.log(colors.red(err));
        }
    },
};