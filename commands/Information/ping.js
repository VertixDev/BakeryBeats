const Discord = require("discord.js")

module.exports = {
    name: "ping",
    timeout: 2500,
    description: "View the Bot's Ping",
    run: async(client, message) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setTitle("🏓 PONG!")
            .setDescription(`My ping is currently \`${client.ws.ping}ms\``)
            .setColor("fcfcfc")
        message.channel.send(embed)
    }
}