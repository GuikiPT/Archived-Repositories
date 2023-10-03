const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Mostra informações de um membro.')
        .setDescription('Info about a user')
        .addUserOption(option => option.setName('membro').setDescription('O Membro')),
    async execute(client, interaction) {
        try {
            let user = await interaction.options.getUser('membro') || interaction.user;
            let member = await interaction.guild.members.cache.get(user.id)

            user = await client.users.fetch(user.id, { force: true });

            const userInfoEmbed = new Discord.EmbedBuilder()
                .setColor('Random')
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }) })
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                .addFields(
                    { name: '**ID**', value: '```\n' + member.user.id + '\n```', inline: false },
                    { name: '**TAG**', value: '```\n' + member.user.tag + '\n```', inline: false },
                    { name: '**CRIADO EM**', value: '```\n' + moment(member.user.createdAt).format('LTS L') + '\n```', inline: false },
                    { name: '**ENTROU EM**', value: '```\n' + moment(member.user.joinedAt).format('LTS L') + '\n```', inline: false },
                    { name: '**MAIOR CARGO**', value: '<@&' + member.roles.highest.id + '>', inline: false },
                )

            if (user.banner) {
                userInfoEmbed.setImage(user.bannerURL({ size: 4096, format: 'png', dinamic: true }));
            }

            return interaction.reply({ embeds: [userInfoEmbed] });
        }
        catch (error) {
            console.error(error.stack);
        }
    },
};


