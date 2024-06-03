const { REST, Routes } = require('discord.js');
const config = require('./config/config');
const fs = require('node:fs');
const path = require('node:path');
const colors = require('colors/safe');
const { BetterLoggingConfigurator, CheckBotVariables, FigletMaker } = require('./functions/ClientFunctions');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

(async function() {
    try {
        await FigletMaker();
        await BetterLoggingConfigurator('slashdeployer');
        await CheckBotVariables();


        const commands = [];
        const foldersPath = path.join(__dirname, 'commands/slash/');
        const commandFolders = fs.readdirSync(foldersPath);

        console.log(colors.white(`🔎 Searching for command files in directory: ${foldersPath}`));

        for (const folder of commandFolders) {
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('data' in command && 'execute' in command) {
                    if (command.allowedServerIds && command.allowedServerIds.length > 0) {
                        console.log(colors.blue(`🔎 Found command '${command.data.name}' with allowed server IDs: ${command.allowedServerIds.join(', ')}`));
                        for (const serverId of command.allowedServerIds) {
                            commands.push({
                                ...command.data.toJSON(),
                                guildId: serverId,
                            });
                        }
                    }
                    else {
                        console.log(colors.blue(`🔎 Found global command '${command.data.name}'`));
                        commands.push(command.data.toJSON());
                    }
                }
                else {
                    console.warn(colors.yellow(`⚠️ The command at ${filePath} is missing a required "data" or "execute" property.`));
                }
            }
        }

        const rest = new REST().setToken(config.discordConfig.discordBotToken);

        (async () => {
            try {
                console.log(colors.white(`⌛ Started refreshing ${commands.length} application (/) commands.`));
                const globalCommands = commands.filter(cmd => !cmd.guildId);
                const guildCommands = commands.filter(cmd => cmd.guildId);

                if (guildCommands.length > 0) {
                    console.log(colors.white('⌛ Deploying commands to specific guilds...'));
                    for (const command of guildCommands) {
                        const guildId = command.guildId;
                        delete command.guildId;
                        await rest.put(Routes.applicationGuildCommands(config.discordConfig.discordBotId, guildId), { body: [] });
                        console.log(colors.green(`✅ Deployed command '${command.name}' to guild ID: ${guildId}`));
                    }
                }

                // Ask the user if they want to update global commands
                rl.question(colors.yellow('Do you want to update global commands? (yes/no): '), async (answer) => {
                    if (answer.trim().toLowerCase() === 'yes') {
                        if (globalCommands.length > 0) {
                            console.log(colors.white('🤔 Deploying globally...'));
                            await rest.put(Routes.applicationCommands(config.discordConfig.discordBotId), { body: [] });
                            console.log(colors.green(`✅ Deployed ${globalCommands.length} commands globally.`));
                        }
                        else {
                            console.log(colors.yellow('No global commands to update.'));
                        }
                    }
                    else {
                        console.log(colors.yellow('Global commands will not be updated.'));
                    }
                    rl.close();
                    console.log(colors.green('✅ Successfully reloaded application (/) commands.'));
                });

            }
            catch (error) {
                console.error(colors.red(`❌ Error refreshing application (/) commands:\n${error.stack || error}`));
            }
        })();


    }
    catch (error) {
        console.error(colors.red(`❌ Error while executing starting script:\n${error.stack || error}`));
        process.exit();
    }
})();
