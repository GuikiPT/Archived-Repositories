const colors = require('colors/safe');
const { FigletMaker, BetterLoggingConfigurator, CheckBotVariables } = require('./functions/ClientFunctions');

(async function() {
    try {
        await FigletMaker();
        await BetterLoggingConfigurator('bot');
        await CheckBotVariables();
        console.log(colors.white('⌛ Starting the Bot . . .'));
        require('./bot');
    }
    catch (error) {
        console.error(colors.red(`❌ Error while executing starting script:\n${error.stack || error}`));
        process.exit();
    }
}());
