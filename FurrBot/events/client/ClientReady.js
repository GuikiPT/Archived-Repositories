const Discord = require('discord.js');
const colors = require('colors/safe');

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    /**
	 *
	 * @param {Discord.Client} client
	 */
    async execute(client) {
        console.log(colors.green(`⚡ Logged in as ${client.user.tag}!`));

        try {
            await client.user.setPresence({
                activities: [
                    {
                        name: ':D',
                        type: Discord.ActivityType.Watching,
                    },
                ],
                status: 'dnd',
            });
        }
        catch (err) {
            console.error(colors.red(err.stack || err));
        }
    },
};