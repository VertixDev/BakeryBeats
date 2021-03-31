const Discord = require("discord.js")

module.exports = {
    name: "move",
    description: "Move a song in the queue up or down.",
    music: true,
    run: async (client, message, args) => {

        // const player = message.client.manager.get(message.guild.id);
        // if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        // const { channel } = message.member.voice;
    
        // if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        // if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        message.channel.send("This command is currently under maintenance and cannot be used at this time.")
    }
}