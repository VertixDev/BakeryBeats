const Discord = require('discord.js')
const appRoot = require("app-root-path")
const config = require(appRoot + "/config/config.json")

module.exports = {
    name: "maintenance",
    description: "Turn the bot onto maintenance mode.",
    run: async (client, message, args) => {

        if (message.author.id !== "394245930288676865") return

        if (client.db.get("maintenanceMode") === true) {
            client.db.delete(`maintenanceMode`)
            return message.channel.send(`Maintenance Mode Disabled.`)
        }

        if (client.db.get("maintenanceMode") === null) {
            client.db.set(`maintenanceMode`, true)
            return message.channel.send(`Maintenance Mode Enabled.`)
        }

    }
}