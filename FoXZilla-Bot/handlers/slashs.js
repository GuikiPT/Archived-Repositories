const fs = require('fs');
const colors = require('colors/safe');

module.exports = async function (client) {
    try{
        const slashFolders = fs.readdirSync(__dirname +  '/../commands/slash/');
        for (const folder of slashFolders) {
            const slashFiles = fs.readdirSync(__dirname +  `/../commands/slash/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of slashFiles) {
                const slash = require(__dirname +  `/../commands/slash/${folder}/${file}`);
                if ('data' in slash && 'execute' in slash) {
                    client.slashCommands.set(slash.data.name, slash);
                } else {
                    console.warn(colors.yellow(`The command at ${__dirname +  `/../commands/slash/` + folder + `/` + file} is missing a required "data" or "execute" property.`));
                }
            }
        }
    }
    catch (error) {
        console.error(colors.red(error.stack || error));
    }
}