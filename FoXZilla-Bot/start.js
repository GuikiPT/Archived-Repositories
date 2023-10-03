const colors = require('colors/safe');
const figlet = require('figlet-promised');
const packageJson = require(__dirname + '/package.json');

figlet('FoXZilla-Bot').then(async function (result) {
    await console.log(colors.bold(colors.yellow(result)));
    await console.log(colors.bold(colors.yellow(' Version: ' + packageJson.version + ' ——————————————————————————— By: ' + packageJson.author)));
    await console.log('\n');
    require(__dirname + '/main.js');
});