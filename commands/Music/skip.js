const Discord = require('discord.js')

module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skip the current song and Change to the next song in the queue",
    music: true,
    timeout: 2500,
    run: async(client, message, args) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");
        const { channel } = message.member.voice;
    
        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)
        
        message.react('✅')

        if(client.db.get(`${message.guild.id}_announcements`) === false) return

        message.guild.channels.cache.get(player.textChannel).send(`\`${player.queue.current.title}\` has been skipped by **${message.author.username}**`)

        player.stop()
        

        
    }
}