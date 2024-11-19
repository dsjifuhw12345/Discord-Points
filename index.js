const { Client, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { clientId, guildId, token, CommandPermissions } = require("./config.js");


client.commands = new Collection()
const commands = []

const commandFiles = fs.readdirSync("commands").filter((file) => file.endsWith(".js"))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    client.commands.set(command.data.name, command)
    commands.push(command.data)
}



const eventsFiles = fs.readdirSync("events").filter((file) => file.endsWith(".js"))
for (const file of eventsFiles) {
    const event = require(`./events/${file}`)
    client.on(event.name, async (...args) => {
        event.execute(client, ...args)
    })
}


const rest = new REST().setToken(token)

client.once("ready", async () => {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands })
console.log("ready " + client.user.username);
    client.user.setStatus("dnd")
    client.user.setActivity("discord.gg/wicks", {
type: ActivityType.Playing
});
});


client.login(token)