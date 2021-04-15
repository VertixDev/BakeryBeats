const Discord = require('discord.js')
const appRoot = require("app-root-path")
const config = require(appRoot + "/config/config.json")

module.exports = {
    name: "clientrestart",
    description: "Restart the bot",
    run: async (client, message, args) => {
        if (message.author.id !== "394245930288676865") return

        else client.db.set("restartChannel", message.channel.id)

        const msg = await message.channel.send("You are about to restart the whole bot, are you sure?")
        msg.react("752784776091664394")
        msg.react("752784797390077952")

        const yesfilter = (reaction, user) => reaction.emoji.id === "752784776091664394" && user.id === message.author.id
        const nofilter = (reaction, user) => reaction.emoji.id === "752784797390077952" && user.id === message.author.id

        const yes = msg.createReactionCollector(yesfilter, {
            time: 60000,
            max: 1
        })

        const no = msg.createReactionCollector(nofilter, {
            time: 60000,
        })

        yes.on("collect", async r => {

            msg.delete()
                .then(m => {
                    client.destroy()
                    client.login(config.token).then(() => {
                        const channel = client.db.get("restartChannel")
                        client.channels.cache.get(channel).send("Restart complete")
                    })
                });



        })

        no.on("collect", r => {
            msg.delete()
            message.channel.send("Let's pretend this never happened.")
        })

    }
}