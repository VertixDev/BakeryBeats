const Discord = require("discord.js")
const functions = require("../../constants/functions")

module.exports = {
    name: "shuffle",
    description: "Randomize the order in which songs in the queue play.",
    timeout: 1500,
    music: true,
    run: async (client, message, args) => {

        try {

        const player = client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        player.set(`beforeshuffle`, player.queue.map(track => track))

        player.queue.shuffle()

        const embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", client.user.displayAvatarURL())
            .setDescription("Successfully shuffled the queue.")
            .setColor("fcfcfc")
        message.channel.send(embed)

        return require("../Music/queue.js")

        } catch (e) {
            functions.error(error, 'Shuffle', message)
        }
    }
}