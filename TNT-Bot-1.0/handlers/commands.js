// Node Modules
const Discord = require('discord.js');
const fs = require('fs');

// Commands Loader
module.exports = async function (client) {
    try {
        const commandFolders = fs.readdirSync(__dirname + '/../commands');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(__dirname + `/../commands/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(__dirname + `/../commands/${folder}/${file}`);
                if ('data' in command && 'execute' in command) {
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at /commands/${folder}/${file} is missing a required "data" or "execute" property.`);
                }
            }
        }
    }
    catch (error) {
        console.error(error.stack);
    }
}