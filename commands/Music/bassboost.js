const Discord = require("discord.js")
const { reply } = require("../../constants/functions")

module.exports = {
    name: "bassboost",
    aliases: ["bb"],
    music: true,
    timeout: 2500,
    description: "Increase the amount of bass on the player",
    run: async (client, message, args) => {


        var bassboost = {
            none: [
                { band: 0, gain: 0 },
                { band: 1, gain: 0 },
                { band: 2, gain: 0 },
                { band: 3, gain: 0 },
                { band: 4, gain: 0 },
                { band: 5, gain: 0 },
                { band: 6, gain: 0 },
                { band: 7, gain: 0 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0 },
                { band: 11, gain: 0 },
                { band: 12, gain: 0 },
                { band: 13, gain: 0 },
            ],
            low: [
                { band: 0, gain: 0.125 },
                { band: 1, gain: 0.25 },
                { band: 2, gain: -0.25 },
                { band: 3, gain: -0.125 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            medium: [
                { band: 0, gain: 0.25 },
                { band: 1, gain: 0.5 },
                { band: 2, gain: -0.5 },
                { band: 3, gain: -0.25 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            high: [
                { band: 0, gain: 0.375 },
                { band: 1, gain: 0.75 },
                { band: 2, gain: -0.75 },
                { band: 3, gain: -0.375 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ],
            earrape: [
                { band: 0, gain: 0.5 },
                { band: 1, gain: 1 },
                { band: 2, gain: -1 },
                { band: 3, gain: -0.5 },
                { band: 4, gain: 0 },
                { band: 5, gain: -0.025 },
                { band: 6, gain: -0.05 },
                { band: 7, gain: -0.0175 },
                { band: 8, gain: 0 },
                { band: 9, gain: 0 },
                { band: 10, gain: 0.025 },
                { band: 11, gain: 0.05 },
                { band: 12, gain: 0.15 },
                { band: 13, gain: 0.25 },
                { band: 14, gain: 0.25 }
            ]
        }

        const { channel } = message.member.voice
        const player = client.manager.players.get(message.guild.id)
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        let level = "none"

        if (!args.length || (!bassboost[args[0].toLowerCase()] && args[0].toLowerCase() !== "none")) return reply(client, message, "Bass boost level must be one of the following: `none`, `low`, `medium`, `high`, `earrape`")

        level = args[0].toLowerCase()

        switch (level) {
            case "none":
                player.clearEQ()
                break

            case "low":
                player.setEQ(bassboost.low)
                break

            case "medium":
                player.setEQ(bassboost.medium)
                break;

            case "high":
                player.setEQ(bassboost.high)
                break
            case "earrape":
                player.setEQ(bassboost.high)
                break;
        }

        const embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", client.user.displayAvatarURL())
            .setDescription(`Set the bass boost to \`${level}\`.`)
            .setColor("fcfcfc")
        return message.channel.send(embed);

    }
}