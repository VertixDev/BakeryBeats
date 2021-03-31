const Discord = require("discord.js")
const functions = require("../../constants/functions")

module.exports = {
    name: "remove",
    description: "Remove a certain song from the Queue",
    music: true,
    aliases: ["r"],
    timeout: 2500,
    run: async (client, message, args) => {

        try {

            const player = message.client.manager.get(message.guild.id);
            if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

            const { channel } = message.member.voice;

            if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
            if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

            if (!args.length) {
                return message.reply("You need to specify which Track you want to remove from the Queue!")
            }

            if (Number(args[0]) > player.queue.size)
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor("Bakery Beats", client.user.displayAvatarURL())
                    .setDescription(`❌ | The queue number you provided was not found.`)
                );

            player.queue.remove(Number(args[0]) - 1);

            return message.channel.send(new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", client.user.displayAvatarURL())
            .setDescription(`Successfully removed Song #${Number(args[0])} from the queue.`)
            .setColor("fcfcfc")
            )

        } catch (e) {
            functions.error(error, 'Remove', message)
        }

    }
}