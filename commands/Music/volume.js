const Discord = require("discord.js")

module.exports = {
    name: "volume",
    description: "Change the Bot's Player Volume",
    aliases: ["vol"],
    music: true,
    timeout: 3000,
    run: async (client, message, args) => {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");
        const { channel } = message.member.voice;
    
        if (!channel) return message.reply("You need to join a Voice Channel to run this command.");
        if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to run my commands.`)

        const volume = Number(args[0]);

        if (!volume || volume < 1 || volume > 100) return message.reply("You need to give me a number that is between 1 - 100 for me to change the volume.");

        const ch = player.textChannel

        player.setVolume(volume);
        return message.reply(`Set Player Volume to \`${volume}\`.`);
    }
}