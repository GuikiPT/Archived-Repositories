// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const colors = require('colors');
// const config = require('../../../../config/config');
/**
 *
 * @param {Discord.Interaction} interaction
 */
module.exports = async function(interaction) {
    try {
        // const firstOwner = config.discordConfig.owner.id;

        // if (!firstOwner) return interaction.reply('This bot don\'t have an expecified owner.', { ephemeral: true });

        // const owner = await interaction.client.users.fetch(firstOwner);

        // if (!owner) {
        //     return interaction.reply('Failed to fetch the information of my owner.', { ephemeral: true });
        // }

        // const authorEmbed = new Discord.EmbedBuilder()
        //     .setColor(config.discordConfig.owner.color || 'White')
        //     .setAuthor({
        //         name: owner.globalName,
        //         iconURL: owner.displayAvatarURL(),
        //     });

        // return interaction.reply({ embeds: [authorEmbed] });

        return interaction.reply('To do...', { ephemeral: true });

    }
    catch (err) {
        console.log(colors.red(err));
    }

};