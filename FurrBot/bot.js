const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const colors = require('colors/safe');
const config = require('./config/config');

const client = new Client({
    intents: [
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        // GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
});
client.SlashCommands = new Collection();


async function HandlingLoader() {
    try {
        const handlers = ['events', 'slash'];
        for (const handler of handlers) {
            console.log(colors.white(`⌛ Loading ${handler} handler`));
            await require(`./handlers/${handler}`)(client);
            console.log(colors.green(`✅ Loaded ${handler} handler`));
        }
    }
    catch (error) {
        console.error(colors.red(`❌ Error while loading Handlers: \n${error.stack || error}`));
    }
}

(async function() {
    try {
        await HandlingLoader();
        client.login(config.discordConfig.discordBotToken)
            .catch((error) => {
                console.error(colors.red(`❌ Error in discord logging method: \n${error.stack || error}`));
            });

    }
    catch (error) {
        console.error(colors.red(`❌ Error in bot main file:\n${error.stack || error}`));
        process.exit();
    }
}());