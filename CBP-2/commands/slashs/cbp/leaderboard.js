const Discord = require('discord.js');
const Database = require('better-sqlite3')(__dirname + '/../../../database/database.db');
const colors = require('colors/safe');
const { pagination, ButtonTypes, ButtonStyles } = require('@devraelfreeze/discordjs-pagination');
const config = require(__dirname + '/../../../config/config.json');
const hooker = require('../../../functions/hooker');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Mostra a tabela de classificação.'),
    async execute(interaction) {
        try {
            if (!config.admins.includes(interaction.user.id)) {
                if (interaction.channel.id != config.leaderboardChat) {
                    return interaction.reply({ content: 'Por favor execute este comando em <#' + config.leaderboardChat + '>.', ephemeral: true });
                }
            }

            const guildId = interaction.guild.id;
            const topUsersStmt = Database.prepare('SELECT * FROM cbp WHERE guildId = ? ORDER BY points DESC');
            const topUsersData = await topUsersStmt.all(guildId);

            if (!topUsersData.length) {
                return await interaction.reply({ content: 'Ainda não há usuários na tabela de classificação.', ephemeral: true });
            }

            console.log("::::::::::::::::::::::::::: TOTAL -> " + topUsersData.length);

            const playersPerPage = 10;
            const pages = Math.ceil(topUsersData.length / playersPerPage);

            const embeds = [];

            for (let page = 0; page < pages; page++) {
                const leaderboardEmbed = new Discord.EmbedBuilder()
                    .setColor('Purple')
                    .setTitle('**Tabela de Classificação**')
                    .setURL('https://cbp2.guiki.pt')
                    .setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true }))
                    .setTimestamp()
                    .setFooter({ text: 'Campeonato Brasileiro de Pixelmon', iconURL: interaction.client.user.displayAvatarURL({ format: 'png', size: 2048, dynamic: true }) })

                const startIdx = page * playersPerPage;
                const endIdx = startIdx + playersPerPage;
                for (let i = startIdx; i < endIdx && i < topUsersData.length; i++) {

                    let targetDisplayName;

                    if(interaction.guild.members.cache.has(topUsersData[i].userId)){
                        console.log('a')
                        const member = await interaction.guild.members.fetch(topUsersData[i].userId);
                        targetDisplayName = member.displayName;
                    }
                    else {
                        console.log('b')
                        targetDisplayName = topUsersData[i].playerName;
                    }

                    leaderboardEmbed.addFields(
                        {
                            name: `**#${i + 1} » ${targetDisplayName} » ${topUsersData[i].points} pts**`,
                            value: `( <:green_up:1132075627751690300> Vitórias: ${topUsersData[i].wins} | <:yellow_down:1132072265681489973> Empates: ${topUsersData[i].draws} | ⭐ Bônus: ${topUsersData[i].bonus} )`
                        }
                    );
                }
                embeds.push(leaderboardEmbed);
            }

            try {
                await pagination({
                    interaction: interaction,
                    embeds: embeds,
                    author: interaction.member.user,
                    time: 60000,
                    fastSkip: true,
                    disableButtons: true,
                    customFilter: (newestInteraction) => {
                        if (newestInteraction.user.id !== interaction.user.id) {
                            newestInteraction.reply({ content: 'Você não pode usar a paginação porque o comando foi executado por outra pessoa.\nExecute o comando para poder usar a paginação.', ephemeral: true });
                            return false;
                        }
                        return true;
                    },
                    buttons: [
                        {
                            type: ButtonTypes.first,
                            label: 'Primeira Página',
                            style: ButtonStyles.Primary,
                            emoji: '⏮'
                        },
                        {
                            type: ButtonTypes.previous,
                            label: 'Página Anterior',
                            style: ButtonStyles.Success,
                            emoji: '◀️'
                        },
                        {
                            type: ButtonTypes.number,
                            label: null,
                            style: ButtonStyles.Success,
                            emoji: '#️⃣'
                        },
                        {
                            type: ButtonTypes.next,
                            label: 'Próxima Página',
                            style: ButtonStyles.Success,
                            emoji: '▶️'
                        },
                        {
                            type: ButtonTypes.last,
                            label: 'Última Página',
                            style: ButtonStyles.Primary,
                            emoji: '⏭️'
                        },
                    ]
                });
                
                const buttonURL = new Discord.ButtonBuilder()
                    .setLabel('LeaderBoard Online')
                    .setURL('https://cbp2.guiki.pt')
                    .setStyle(Discord.ButtonStyle.Link)    
                const row = new Discord.ActionRowBuilder()
                    .addComponents(buttonURL)
                await interaction.channel.send({ components: [row] });
            }
            catch (error) {
                await hooker.commandErrorHooker(interaction.client, '/leaderboard', 'Sending Paginator', error);
                console.error(colors.red('Error while sending paginator of /leaderboard:\n', error.stack));
            }
        } catch (error) {
            await hooker.commandErrorHooker(interaction.client, '/leaderboard', undefined, error);
            console.error(colors.red('Error while executing /leaderboard:\n', error.stack));
        }
    },
};
