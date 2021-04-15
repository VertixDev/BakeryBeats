const Discord = require("discord.js")

module.exports = {
    name: "restart",
    description: "Restart the song and set the Time to 0:00",
    music: true,
    timeout: 2000,
    run: async(client, message, args) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        const { channel } = message.member.voice;
    
        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        player.seek(0)

        const embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setDescription(`Successfully restarted [\`${player.queue.current.title}\`](${player.queue.current.uri})`)
            .setColor("fcfcfc")
        message.channel.send(embed)
    }
}