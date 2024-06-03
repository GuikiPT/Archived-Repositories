const colors = require('colors/safe');
const config = require('../config/config');
const figlet = require('figlet-promised');
const packageJson = require('../package.json');
const moment = require('moment');

module.exports = {
    BetterLoggingConfigurator: async function(type) {
        try {
            console.log(colors.white('⌛ Setting up better-logging system.'));
            require('better-logging')(console, {
                format: (ctx) => `${ctx.time} ${ctx.date} ${ctx.type} >> ${ctx.msg}`,
                saveToFile: `${__dirname}/../logs/${type}/${moment().format('YYYY/MM/DD')}.log`,
            });
            console.log(colors.green('✅ Better Logging System Loaded.'));
        }
        catch (error) {
            console.error(colors.red(`❌ Error while setting up better logging system:\n${error.stack || error}`));
            process.exit();
        }
    },
    CheckBotVariables: async function() {
        try {
            console.log(colors.white('⌛ Checking for Secret Variables.'));
            if (!config.discordConfig.discordBotToken) {
                console.warn(colors.yellow('⚠️  Discord Bot Token is missing from the config file. Exiting . . .'));
                process.exit();
            }
            if (!config.discordConfig.discordBotId) {
                console.warn(colors.yellow('⚠️  Discord Bot Id is missing from the config file. Exiting . . .'));
                process.exit();
            }
            if (!config.discordConfig.ownersIds) {
                console.warn(colors.yellow('⚠️  Discord Bot Owners Id is missing from the config file. Exiting . . .'));
                process.exit();
            }
            console.log(colors.green('✅ All needed variables are defined.'));
        }
        catch (error) {
            console.error(colors.red(`❌ Error while Checking for secret variables:\n${error.stack || error}`));
            process.exit();
        }
    },
    FigletMaker: async function() {
        try {
            const result = await figlet('FurrBot');
            console.log(colors.bold(colors.rainbow(result.toString())));
            console.log(colors.bold(colors.rainbow(`Version ${packageJson.version} | By ${packageJson.author}\n`)));
        }
        catch (error) {
            console.error(colors.red(`❌ Error while making the figlet:\n${error.stack || error}`));
            process.exit();
        }
    },
};