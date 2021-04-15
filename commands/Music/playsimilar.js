const Discord = require(`discord.js`);
const { MessageEmbed } = require(`discord.js`);
const { delay } = require("../../constants/functions")
const functions = require("../../constants/functions")
module.exports = {
    name: `playsimilar`,
    aliases: [`ps`, `searchsimilar`],
    music: true,
    description: `Searches for a song that is similar to the current track.`,
    run: async (client, message) => {
        try {

            const player = message.client.manager.get(message.guild.id);
            if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");
    
            const { channel } = message.member.voice;
        
            if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
            if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)
            
            message.channel.send(`Searching for Similar Tracks. This may take a moment...`)
            const mixURL = `https://www.youtube.com/watch?v=${player.queue.current.identifier}&list=RD${player.queue.current.identifier}`
            const res = await player.search(mixURL, message.author);

            
            await delay(2500)

            const randomtracknum = Math.floor(Math.random() * Math.floor(res.tracks.length));
            player.queue.add(res.tracks[randomtracknum])

            let a = new Discord.MessageEmbed()
                .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
                .setColor("fcfcfc")
                .setDescription(`Automatically added \`${res.tracks[randomtracknum].title.substr(0, 256-3)}\` to the queue.`)
                .setFooter("This song may not be similar, as it was chosen by YouTube's A.I.")

            return message.channel.send(a)


        } catch (error) {
            functions.error(error, 'Playsimilar', message)
        }
    }
};
