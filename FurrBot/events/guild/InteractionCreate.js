const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    name: Discord.Events.InteractionCreate,
    once: false,
    /**
     *
     * @param {Discord.Interaction} interaction
     */
    async execute(interaction) {
        try {
            if (interaction.isChatInputCommand()) {
                const command = await interaction.client.SlashCommands.get(interaction.commandName);

                if (!command) return;

                try {
                    await command.execute(interaction);
                }
                catch (error) {
                    console.error(colors.red(`❌ Error while executing command '${interaction.commandName}':\n${error.stack || error}`));
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                    }
                    else {
                        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                    }
                }
            }
            else if (interaction.isAutocomplete()) {
                const command = interaction.client.SlashCommands.get(interaction.commandName);

                if (!command) return;

                try {
                    await command.autocomplete(interaction);
                }
                catch (error) {
                    console.error(colors.red(`❌ Error while executing autocomplete for command '${interaction.commandName}':\n${error.stack || error}`));
                }
            }
        }
        catch (error) {
            console.error(colors.red(`❌ Error while managing an Interaction Event:\n${error.stack || error}`));
        }

    },
};
