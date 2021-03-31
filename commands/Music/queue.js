const Discord = require("discord.js")
const functions = require('../../constants/functions.js')

module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "View the list of songs currently queued in the Player for this server.",
    timeout: 2500,
    run: async (client, message, args) => {

        try {

        const player = message.client.manager.get(message.guild.id);
        if (!player) return message.reply("There is no Player currently active for this server. Play a song with \`bb!play <song>\`.");

        const queue = player.queue;
        const embed = new Discord.MessageEmbed()
            .setTitle(`🎵 Queue for ${message.guild.name}`)
            .setAuthor(`Bakery Beats`, client.user.displayAvatarURL())
            .setColor("fcfcfc")

        // change for the amount of tracks per page
        const multiple = 10;
        const page = args.length && Number(args[0]) ? Number(args[0]) : 1;

        const end = page * multiple;
        const start = end - multiple;

        const tracks = queue.slice(start, end);

        if (queue.current) embed.addField("Now Playing:", `[${queue.current.title}](${queue.current.uri})`);

        if (!tracks.length) embed.setDescription(`No Songs found in ${page > 1 ? `Page ${page}` : "the queue"}.`);
        else embed.setDescription(tracks.map((track, i) => `${start + (++i)} - [${track.title}](${track.uri})`).join("\n"));

        const maxPages = Math.ceil(queue.length / multiple);

        embed.setFooter(`Page ${page > maxPages ? maxPages : page} of ${maxPages}`);

        return message.reply(embed);

        } catch (e) {
            functions.error(e, "Queue", message)
        }

    }
}