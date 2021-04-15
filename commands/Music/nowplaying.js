const { Utils } = require("erela.js")
const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags")
const functions = require("../../constants/functions")

module.exports = {
    name: "nowplaying",
    aliases: ["np", "now"],
    music: true,
    timeout: 2500,
    description: "Displays what the bot is currently playing.",
    run: async (client, message, args) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (player.position > 5000) {
            getnowplaying()
        }
        if (player.position < 5000) {
            setTimeout(() => {
                getnowplaying()
            }, 3000)
        }

        function getnowplaying() {
            let { title, author, duration, thumbnail, requester } = player.queue.current
            let amount = `${player.position}`
            const part = Math.floor((player.position / duration) * 10);
            const giveEmbed = new MessageEmbed()
                .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
                .setColor("fcfcfc")
                .setDescription(`${player.playing ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${functions.format(amount)} / ${functions.format(duration)}]\nRequested By: ${requester.tag}`)
            giveEmbed.setThumbnail(thumbnail)

            message.channel.send({ embed: giveEmbed }).then(m => {

                try {
                    const counter = setInterval(() => {

                        if (player.playing !== true) {
                            clearInterval(counter)
                        }

                        if (player.position > 5000) {
                            if (player.position < 60000) {
                                if (player.playing === true) {
                                    let { title, author, duration, thumbnail, requester } = player.queue.current
                                    let amount = `${msToTime(player.position)}`
                                    const part = Math.floor((player.position / duration) * 10);
                                    giveEmbed.setDescription(`${player.playing ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(10 - part)}[${functions.format(amount)} / ${functions.format(duration)}]\nRequested By: ${requester.tag}`)
                                    giveEmbed.setThumbnail(thumbnail)
                                    giveEmbed.setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
                                }
                            } else {
                                if (player.playing === true) {
                                    let { title, author, duration, thumbnail, requester } = player.queue.current
                                    let amount = `${msToTime(player.position)}`
                                    const part = Math.floor((player.position / duration) * 10);
                                    giveEmbed.setDescription(`${player.paused ? "▶️" : "⏸️"} Currently Playing ${title}\n${"▬".repeat(part) + "🔘" + "▬".repeat(9 - part)}[${functions.format(amount)} / ${functions.format(duration)}]\nRequested By: ${requester.tag}`)
                                    giveEmbed.setThumbnail(thumbnail)
                                    giveEmbed.setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
                                }
                            }
                        }
                        m.edit(giveEmbed)
                    }, 35000)

                } catch (e) {
                    return clearInterval(counter)
                }

            })
        }

        function msToTime(duration) {
            var milliseconds = parseInt((duration % 1000) / 100)
                , seconds = parseInt((duration / 1000) % 60)
                , minutes = parseInt((duration / (1000 * 60)) % 60)
                , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;

            return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
        }
    }
}