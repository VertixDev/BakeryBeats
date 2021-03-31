const Discord = require("discord.js")
const functions = require("../../constants/functions")

module.exports = {
    name: "unshuffle",
    description: "Returns the Queue back into it's original state where the songs are not shuffled.",
    cooldown: 5000,
    run: async (client, message, args) => {

        try {

            const player = client.manager.get(message.guild.id);
            if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

            const { channel } = message.member.voice;

            if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
            if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

            if (!player.get(`beforeshuffle`)) {
                return message.channel.send(new Discord.MessageEmbed()
                    .setColor("RED")
                    .setAuthor("Bakery Beats", client.user.displayAvatarURL())
                    .setDescription(`${`❌ | The queue isn't currently shuffled!.`}`)
                    .setFooter("To shuffle the queue, run bb!shuffle")
                );
            }

            player.queue.clear()
            for (const track of player.get(`beforeshuffle`))
                player.queue.add(track);

            return message.channel.send(new Discord.MessageEmbed()
                .setAuthor("Bakery Beats", client.user.displayAvatarURL())
                .setDescription(`The Queue has successfully been unshuffled and reverted to it's original state.`)
                .setColor("#fcfcfc")
                .setFooter(`You can reshuffle the queue with bb!shuffle`))

        } catch (e) {
            functions.error(error, 'Playsimilar', message)
        }
    }
}




