// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const fs = require('fs');
const colors = require('colors/safe');

/**
 *
 * @param {Discord.Client} client
 */
module.exports = async function(client) {
    let numberOfLoadedEvents = 0;

    try {
        const eventFolders = fs.readdirSync(__dirname + '/../events');

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(__dirname + `/../events/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of eventFiles) {
                try {
                    console.log(colors.white(`⌛ Loading ${file} event.`));
                    const event = require(__dirname + `/../events/${folder}/${file}`);
                    if (event.once) {
                        await client.once(event.name, (...args) => event.execute(...args));
                    }
                    else {
                        await client.on(event.name, (...args) => event.execute(...args));
                    }
                    console.log(colors.green(`✅ Loaded ${file} event.`));
                    numberOfLoadedEvents++;
                }
                catch (error) {
                    console.error(colors.red(`❌ Error loading ${file} event:\n${error.stack || error}`));
                }
            }
        }

        console.log(colors.green(`✅ Loaded ${numberOfLoadedEvents} events`));
    }
    catch (error) {
        console.error(colors.red(`❌ Error reading event folders:\n${error.stack || error}`));
    }
};
