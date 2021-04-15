const Discord = require("discord.js")
const { format, error } = require("../../constants/functions.js")

module.exports = {
    name: "seek",
    description: "Skip to a certain timestamp on the current playing song.",
    timeout: 3000,
    music: true,
    run: async (client, message, args) => {

        try {

        const player = client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        const { channel } = message.member.voice;

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        if (Number(args[0]) < 0 || Number(args[0]) >= player.queue.current.duration / 1000)
        return message.channel.send(new Discord.MessageEmbed()
                .setColor("RED")
                .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
                .setDescription(`${`❌ | You may seek from \`0\` - \`${player.queue.current.duration / 1000}\``}`)
            );

            player.seek(Number(args[0]) * 1000);
            return message.channel.send(new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setDescription(`Successfully skipped to ${format(Number(args[0]) * 1000)}`)
            .setColor("fcfcfc"))

        } catch (e) {
            functions.error(error, 'Playsimilar', message)
        }
    }
}