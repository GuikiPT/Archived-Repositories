const Discord = require('discord.js');
const fs = require('fs');
require('dotenv').config({});

const commands = [];

const commandFolders = fs.readdirSync(__dirname + '/commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(__dirname + `/commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(__dirname + `/commands/${folder}/${file}`);
        commands.push(command.data.toJSON());
    }
}

const rest = new Discord.REST({ version: '10' }).setToken(process.env.DiscordToken);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Discord.Routes.applicationGuildCommands(process.env.DiscordClientId, process.env.DiscordSlashGuildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error.stack);
    }
})();