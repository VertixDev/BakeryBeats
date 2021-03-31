const Discord = require('discord.js')
const { reply } = require("../../constants/functions")

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    music: true,
    timeout: 3000,
    description: "Turn on or turn off looping for whatever song is currently playing.",
    run: async (client, message, args) => {

        const { channel } = message.member.voice;

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        if(!player.queue.current.title) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (args.length && /queue/i.test(args[0])) {
            player.setQueueRepeat(!player.queueRepeat);
            const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
            reply(client, message, `Queue Repeat has successfully been ${queueRepeat}`);
            if(message.channel.id === player.textChannel) return
            message.guild.channels.cache.get(player.textChannel).send(`Queue Repeat has been ${queueRepeat} by **${message.author.username}**`)
            return
        }

        else {
            player.setTrackRepeat(!player.trackRepeat);
            const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
            reply(client, message, `Successfully ${trackRepeat} track repeating for the song: [\`${player.queue.current.title}\`](${player.queue.current.uri})`);
            if(message.channel.id === player.textChannel) return
            message.guild.channels.cache.get(player.textChannel).send(`Track Repeat has been ${trackRepeat} by **${message.author.username}**`)
        }
    }
}