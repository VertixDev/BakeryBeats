const Discord = require('discord.js')

module.exports = {
    name: "stop",
    aliases: ["dc"],
    description: "Stop the Bot from playing Music and Disconnect it from the Voice Channel",
    music: true,
    timeout: 3500,
    run: async(client, message, args) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        const { channel } = message.member.voice;
    
        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        player.stop()
        player.destroy()

        message.react("👋")
        const txtchannel = message.guild.channels.cache.get(player.textChannel)

        txtchannel.send("The Player has disconnected as **" + message.author.username + "** has ran the `stop` command.")
    }
}