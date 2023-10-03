const Discord = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const moment = require('moment');
const colors = require('colors/safe');
require('better-logging')(console, {
    format: ctx => `${colors.grey('[' + moment().format('LT') + ']')} ${colors.grey('[' + moment().format('L') + ']')} ${ctx.type} >> ${ctx.msg}`,
    saveToFile: `${__dirname}/logs/${moment().format('YYYY')}/${moment().format('MM')}/${moment().format('DD')}.log`,
    color: {
        base: colors.grey,
        type: {
            debug: colors.green,
            info: colors.white,
            log: colors.grey,
            error: colors.red,
            warn: colors.yellow,
        }
    },
});

const commands = [];

const commandFolders = fs.readdirSync(__dirname + '/commands/slash');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(__dirname + `/commands/slash/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(__dirname + `/commands/slash/${folder}/${file}`);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(colors.yellow(`The command "${__dirname + `/commands/slash/${folder}/${file}`}" is missing a required "data" or "execute" property.`));
        }
    }
}

if (!process.env.DiscordToken) return console.warn(colors.yellow('You must provide a discord bot token before to use this command!'));
if (!process.env.DiscordClientId) return console.warn(colors.yellow('You must provide a discord client id before to use this command!'))
if (!process.env.DiscordSlashGuildId) return console.warn(colors.yellow('You must provide a discord slash guild id before to use this command!'))

const rest = new Discord.REST({ version: '10' }).setToken(process.env.DiscordToken);
(async () => {
    try {
        console.info(colors.blue(`Started refreshing ${commands.length} application (/) commands.`));

        const data = await rest.put(
            Discord.Routes.applicationGuildCommands(process.env.DiscordClientId, process.env.DiscordSlashGuildId),
            { body: commands },
        );

        console.info(colors.green(`Successfully reloaded ${data.length} application (/) commands.`));
    } catch (error) {
        console.error(colors.red(error.stack || error));
    }
})();