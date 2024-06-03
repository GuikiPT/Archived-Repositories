const fs = require('fs');
const colors = require('colors/safe');

module.exports = async function(client) {
    let numberOfLoadedSlashs = 0;

    try {
        const commandFolders = fs.readdirSync(__dirname + '/../commands/slash/');

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(__dirname + `/../commands/slash/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                try {
                    console.log(colors.white(`⌛ Loading ${file} slash command.`));
                    const command = require(__dirname + `/../commands/slash/${folder}/${file}`);
                    client.SlashCommands.set(command.data.name, command);
                    numberOfLoadedSlashs++;
                    console.log(colors.green(`✅ Loaded ${file} slash command.`));
                }
                catch (err) {
                    console.error(colors.red(`❌ Error loading ${file} slash command:\n${err.stack || err}`));
                }
            }
        }
        console.log(colors.green(`✅ Loaded ${numberOfLoadedSlashs} slash commands`));
    }
    catch (error) {
        console.error(colors.red(`❌ Error loading slash commands:\n${error.stack || error}`));
    }
};
