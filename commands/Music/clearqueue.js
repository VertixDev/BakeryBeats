const Discord = require("discord.js");
const functions = require("../../constants/functions");

module.exports = {
    name: "clearqueue",
    description: "Clear the Queue of the Player",
    aliases: ["cq"],
    timeout: 5000,
    music: true,
    run: async (client, message, args) => {
        try {

        const { channel } = message.member.voice;

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        player.queue.clear()
        functions.reply(client, message, "The Queue has successfully been cleared.")
        
    } catch(e) {
        functions.error(e, "Clearqueue", message)
    }
}
}