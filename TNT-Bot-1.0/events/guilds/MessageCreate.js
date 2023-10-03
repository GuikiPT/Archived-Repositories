const Discord = require('discord.js');

module.exports = {
    name: Discord.Events.MessageCreate,
    once: false,
    async execute(client, message) {
        try {
            if (message.author.bot) return;

            if (message.channel.id == process.env.CounterChannelId) {
                counterFunction(client, message);
            }
        }
        catch (error) {
            console.error(error.stack);
        }
    },
};

async function counterFunction(client, message) {
    try {
        const member = await message.guild.members.cache.get(message.author.id);
        const alternativeChannel = await client.channels.cache.get(process.env.CounterAlternativeChannelId);
        const logChannel = await client.channels.cache.get(process.env.CounterLogChannelId);

        var messageContent;
        if (message.content.length <= 512) {
            messageContent = message.content;
        }
        else {
            messageContent = message.content.substring(0, 512) + '...';
        }

        if (isNaN(message.content)) {
            if (member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                const warnAdmAboutNumericOnlyChannelEmbed = new Discord.EmbedBuilder()
                    .setColor('Red')
                    .setTitle('Você mandou uma mensagem com texto no canal `' + message.channel.name + '`')
                    .setDescription('Se você não fez propositadamente aconselho-o a eliminar a [mensagem de texto](' + message.url + ').')
                    .addFields(
                        { name: '***Conteúdo da sua mensagem:***', value: '```' + messageContent + '```' },
                    )
                    .setTimestamp()
                try {
                    return message.author.send({ embeds: [warnAdmAboutNumericOnlyChannelEmbed] }).catch(() => {
                        return logChannel.send({ content: `<@${message.author.id}>`, embeds: [warnAdmAboutNumericOnlyChannelEmbed] });
                    });
                }
                catch (error) {
                    console.error(error.stack || error);
                }
            }

            try {
                message.delete();
                member.timeout(60_000);
            }
            catch (error) {
                console.error(error.stack || error);
            }

            const onlyNumberChannelWarnEmbed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setTitle('❌ | Apenas são aceitos números no canal do `' + message.channel.name + '` !')
                .setDescription('Como aviso, você foi mutado por 1 minuto.')
                .addFields(
                    { name: '***Conteúdo da sua mensagem:***', value: '```' + messageContent + '```' },
                )
                .setTimestamp()
            try {
                message.author.send({ embeds: [onlyNumberChannelWarnEmbed] }).catch(() => {
                    alternativeChannel.send({ content: `<@${message.author.id}>`, embeds: [onlyNumberChannelWarnEmbed] });
                });
            }
            catch (error) {
                console.error(error.stack || error);
            }

            const logWarnNonNumberMessageEmbed = new Discord.EmbedBuilder()
                .setColor('Red')
                .setThumbnail(message.author.displayAvatarURL({ format: 'png', size: 2048, dynamic: 'true' }))
                .setTitle('❌ | `' + message.author.tag + '` foi avisado por enviar caracteres não numericos.')
                .setDescription('```Como consequencia de ter postado caracteres não numericos o membro levou mute de 1 minuto como aviso```')
                .addFields(
                    { name: 'Texto que você enviou:', value: '```' + messageContent + '```' },
                )
                .setTimestamp()
            try {
                logChannel.send({ embeds: [logWarnNonNumberMessageEmbed] });
            }
            catch (error) {
                console.error(error.stack || error);
            }
            return;
        }
        else {
            message.channel.messages.fetch({ limit: 2 }).then(async messages => {
                let nextToLastMessage = messages.last();
                var nextToLastMessageContent;

                if (!nextToLastMessage.content.length <= 512) {
                    nextToLastMessageContent = nextToLastMessage.content;
                }
                else {
                    nextToLastMessage = nextToLastMessage.content.substring(0, 512) + '...';
                }

                if (Number(messages.last().content) + 1 == Number(messages.first().content)) return;
                else {
                    if (member.permissions.has(Discord.PermissionsBitField.Flags.Administrator)) {
                        // TODO: Try to delete admin author message and warn it. If the bot can't delete the message, warn adm author to delete they mistake.
                        const admMistakeCounterEmbed = new Discord.EmbedBuilder()
                            .setColor('Red')
                            .setTitle('❌ | Você errou a contagem!')
                            .setDescription('***Você deve eliminar sua [mensagem](' + message.url + ')!***\nVisto que você tambêm é administrador, é possivel eu não ter permissões para eliminar mensagens de outros administradores.\nOs administradores não conseguem eliminar mensagens uns dos outros dependendo das configurações dos cargos!')
                            .addFields(
                                { name: 'Número que você enviou:', value: '```' + messageContent + '```' },
                                { name: 'Número que foi enviado antes da sua mensagem:', value: '```' + nextToLastMessageContent + '```' },
                            )
                            .setTimestamp()
                        try {
                            return message.author.send({ embeds: [admMistakeCounterEmbed] }).catch(() => {
                                return logChannel.send({ content: `<@${message.author.id}>`, embeds: [admMistakeCounterEmbed] });
                            });
                        }
                        catch (error) {
                            console.error(error.stack || error);
                        }
                    }
                    else {
                        try {
                            message.delete();
                            member.timeout(900_000);
                        }
                        catch (error) {
                            console.error(error.stack || error);
                        }

                        const sendWarnToUserEmbed = new Discord.EmbedBuilder()
                            .setTitle('❌ | Você foi mutado por 15 minutos por ter errado a contagem numérica em `' + message.channel.name + '`')
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                            .setImage('https://media.tenor.com/NyG-ox1TuXAAAAAC/purplecliffe-cliffe.gif')
                            .addFields(
                                { name: 'Número que você enviou:', value: '```' + messageContent + '```' },
                                { name: 'Número que foi enviado antes da sua mensagem:', value: '```' + nextToLastMessageContent + '```' },
                            )
                            .setTimestamp()
                        message.author.send({ embeds: [sendWarnToUserEmbed] }).catch(() => {
                            alternativeChannel.send({ content: `<@${message.author.id}>`, embeds: [sendWarnToUserEmbed] });;
                        });

                        const alertChannelEmbed = new Discord.EmbedBuilder()
                            .setTitle('❌ | Novo Membro foi mutado por 15 Minutos por errar na contagem')
                            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))
                            .setImage('https://media.tenor.com/NyG-ox1TuXAAAAAC/purplecliffe-cliffe.gif')
                            .addFields(
                                { name: 'Membro', value: `<@${message.author.id}> - ${message.author.tag} - ${message.author.id}` },
                                { name: 'Número que ele enviou:', value: '```' + messageContent + '```' },
                                { name: 'Número que foi enviado antes da mensagem dele:', value: '```' + nextToLastMessageContent + '```' },
                            )
                        return logChannel.send({ embeds: [alertChannelEmbed] });
                    }
                }
            });
        }
    }
    catch (error) {
        console.error(error.stack);
    }
}