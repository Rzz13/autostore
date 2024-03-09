const client = require('../index');
const config = require("../config/config.json");
const { REST, Routes } = require('discord.js');
const fs = require('fs')
const colors = require('colors');

module.exports = async () => {
    console.log("----------------------------------------".yellow);

    const slash = [];

    fs.readdirSync('./src/slashCommands/').forEach(dir => {
        const commands = fs.readdirSync(`./src/slashCommands/${dir}`).filter(file => file.endsWith('.js'));
        for (let file of commands) {
            let pull = require(`../slashCommands/${dir}/${file}`);

            if (pull.name) {
                slash.push(pull)
                client.slash.set(pull.name, pull);
                console.log(`[HANDLER -  SLASH] Loaded a file : ${pull.name}`.green);
            } else {
                console.log(`[HANDLER - SLASH] Couldn't load the file ${file}, missing module name value.`.red)
                continue;
            }
        }
    });

    if (!config.CLIENTID) {
        console.log("[CRUSH] You have to provide your client ID in config file".red + "\n");
        return process.exit()
    };

    const CLIEND_ID = config.CLIENTID;
    const GUILD_ID = config.serverId;

    const rest = new REST({ version: '10' }).setToken(config.TOKEN);

    if (config.MODE === "Public") {
        await rest.put(
            Routes.applicationCommands(CLIEND_ID),
            { body: slash }
        )
            .then(() => {
                console.log("----------------------------------------".magenta);
                console.log(`[HANDLER - SLASH] Slash commands has been registered successfully to all the guilds`.magenta.bold);
                console.log("----------------------------------------".magenta);
            });
    }
    if (config.MODE === "Private") {
        await rest.put(
            Routes.applicationCommands(CLIEND_ID, GUILD_ID),
            { body: slash }
        )
            .then(() => {
                console.log("----------------------------------------".magenta);
                console.log(`[HANDLER - SLASH] Slash commands has been registered successfully to Server`.magenta.bold);
                console.log("----------------------------------------".magenta);
            });
    }

    /*await rest.put(
        Routes.applicationCommands(CLIEND_ID),
        { body: slash }
    ).then(() => {
        console.log("----------------------------------------".magenta);
        console.log(`[HANDLER - SLASH] Slash commands has been registered successfully to all the guilds`.magenta.bold);
        console.log("----------------------------------------".magenta);
    })*/
}

/**
 * ======================================================
 * Developed by FlameQuard | https://flamequard.tech
 * ======================================================
 * Mention FlameQuard when you use this codes
 * ======================================================
 * Give an awesome start to this repositories
 * ======================================================
 */