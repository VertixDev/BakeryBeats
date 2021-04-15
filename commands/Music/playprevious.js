const Discord = require("discord.js")

module.exports = {
    name: "playprevious",
    aliases: [`pp`],
    description: `Replay the last song that played.`,
    music: true,
    run: async (client, message, args) => {

        const { channel } = message.member.voice;

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)
        
        const res = await player.search(player.queue.previous.uri, message.author);
        player.queue.add(res.tracks[0])

        const embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setColor("fcfcfc")
            .setDescription(`Automatically added [\`${res.tracks[0].title.substr(0, 256 - 3)}\`](${res.tracks[0].uri}) to the queue.`)
            .setFooter("This was the song that was most recently played.")
        return message.channel.send(embed)
    }
}