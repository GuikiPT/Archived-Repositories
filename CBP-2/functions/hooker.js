const axios = require('axios');

module.exports = {
    commandErrorHooker: async function (client, commandName, commandLocateDescription, error) {
        let errorMSg = '```\n' + (error.stack || error) + '\n```';

        const maxLength = 512;
        if (errorMSg.length > maxLength) {
            errorMSg = errorMSg.substring(0, maxLength - 5) + '\n...```';
        }
        const params = {
            username: "CBP2-Logger",
            avatar_url: "https://cdn.discordapp.com/avatars/1131679754957885500/58e70b5d18a772919ac2dc74d912287c.png",
            content: "<@!926914230924509264>",
            embeds: [
                {
                    color: 0xff0000,
                    title: 'Foi encontrado um erro na execução do bot!!!!',
                    fields: [
                        ...(commandName ? [{ name: '**Nome do Comando**', value: '```\n' + commandName + '\n```' }] : []),
                        { name: '**Error Log**', value: errorMSg },
                        ...(commandLocateDescription ? [{ name: '**Command Locate Description**', value: '```\n' + commandLocateDescription + '\n```' }] : [])
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        };
        
        try {
            await axios.post(process.env.DiscordErrorHookUrl, params);
            console.log('Webhook sent successfully.');
        } catch (err) {
            console.error('Error sending webhook:', err.message);
        }
    },
};
