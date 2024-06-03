const Discord = require('discord.js');
const colors = require('colors');
/**
 *
 * @param {Discord.Interaction} interaction
 */
module.exports = async function(interaction) {
    try {
        await interaction.reply({ content: '<a:furrwaiting:1232724525125337148>', fetchReply: true }).then(async (reply) => {
            const ping = reply.createdTimestamp - interaction.createdTimestamp;
            const pingEmbed = new Discord.EmbedBuilder()
                .setColor('#967b69')
                .setTitle('🧨 | Pong!')
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true, size: 1024, format: 'png' }))
                .addFields(
                    { name: '**Bot Latency**', value: '```ini\n [ ' + ping + 'ms ]\n```', inline: false },
                    { name: '**API Connection Latency**', value: '```ini\n [ ' + Math.round(interaction.client.ws.ping) + 'ms ]\n```', inline: false },
                )
                .setTimestamp();
            await interaction.editReply({ content: '', embeds: [pingEmbed] });
        });
    }
    catch (err) {
        console.log(colors.red(err));
    }

};