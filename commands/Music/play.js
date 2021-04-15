const Discord = require('discord.js')
const { Manager } = require("erela.js")
const functions = require("../../constants/functions")
const { reply } = require("../../constants/functions.js")

module.exports = {
  name: 'play',
  aliases: ["p"],
  description: "Play a Song through the Bot in a Voice Channel",
  timeout: 3000,
  music: true,
  run: async (client, message, args) => {

    try {
      const { channel } = message.member.voice;

      if (!channel) return message.reply('You need to join a Voice Channel in order for me to play music.');
      if (message.guild.me.voice.channel && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(`I am already playing music inside of the **${message.guild.me.voice.channel.name}** Voice Channel. Once you join that Voice Channel, you will be able to request songs.`)
      if (!args.length) return message.reply('You need to supply either a URL or Song Name for me to search.');

      const permissions = channel.permissionsFor(client.user);

      if (!permissions.has("CONNECT"))
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription("❌ | I need permissions to join your voice channel.")
          .setAuthor(client.user.username, "https://i.imgur.com/Eb2ki9u.png")
        );
      if (!permissions.has("SPEAK"))
        return message.channel.send(new Discord.MessageEmbed()
          .setColor("RED")
          .setDescription("❌ | I need permissions to speak in your voice channel.")
          .setAuthor(client.user.username, "https://i.imgur.com/Eb2ki9u.png")
        );


      const player = client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        selfDeafen: true
      });


      if (player.state !== "CONNECTED") player.connect();

      const search = args.join(' ');
      let res;

      try {
        res = await player.search(search, message.author);
        if (res.loadType === 'LOAD_FAILED') {
          if (!player.queue.current) player.destroy();
          throw res.exception;
        }
      } catch (err) {
        console.log(err)
      }

      switch (res.loadType) {

        case 'NO_MATCHES':
          if (!player.queue.current) player.destroy();
          return reply(client, message, 'No Songs were able to be found for: `' + search + '`');
        case 'TRACK_LOADED':

          if (res.tracks[0].duration > 600000 && !client.db.get(`${message.guild.id}_premium`)) return reply(client, message, `This server must have **Bakery Beats Premium** in order to queue songs that are longer than 15 minutes. \n(This message also shows if you are attempting to add a livestream to the queue)`)

          player.queue.add(res.tracks[0])

          if (!player.playing && !player.paused && !player.queue.size) player.play();
          let embed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setColor("fcfcfc")
            .setDescription(`Successfully added [\`${res.tracks[0].title}\`](${res.tracks[0].uri}) to the queue.`)

          if (player.queue.size === 0) {
            embed.setFooter("This is the only song in the queue.")
          } else {
            embed.setFooter(`The Queue Length is now ${player.queue.size}`)
          }

          return message.channel.send(embed)


        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks)

          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
          return message.channel.send(new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setColor("fcfcfc")
            .setDescription(`Successfully added \`${res.playlist.name}\` with \`${res.tracks.length}\` songs to the queue.`)
            .setFooter(`The Queue Length is now ${player.queue.size}`)
          )

        case 'SEARCH_RESULT':
          message.react("🔍")
          let max = 5, collected, filter = (m) => m.author.id === message.author.id

          if (res.tracks.length < max) max = res.tracks.length;

          const results = res.tracks
            .slice(0, max)
            .map((track, index) => `${++index} - [${track.title}](${track.uri})`)
            .join('\n');

          const searchEmbed = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setDescription(results)
            .setFooter("Respond with a number to play that track, or respond with \"cancel\" to cancel.")
            .setColor('fcfcfc')
          message.channel.send(searchEmbed)

          try {
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
          } catch (e) {
            if (!player.queue.current) player.destroy();
            return message.reply("You did not respond in time, please re-run this command.");
          }

          const first = collected.first().content;


          if (isNaN(first)) {
            if (!player.queue.current) player.destroy();
            return message.channel.send('You did not provide a number from the above menu. Please run the command again but supply a number on your next search.');
          }

          const index = Number(first) - 1;
          if (index < 0 || index > max - 1) return message.reply(`That is not a selection from the above menu. Please pick a valid number. (1 - ${max}).`);

          const track = res.tracks[index];

          if (track.duration > 600000 && !client.db.get(`${message.guild.id}_premium`)) {
            return reply(client, message, `This server must have **Bakery Beats Premium** in order to queue songs that are longer than 15 minutes. \n(This message also shows if you are attempting to add a livestream to the queue)`)
          }

          player.queue.add(track);

          if (!player.playing && !player.paused && !player.queue.size) player.play();
          let a = new Discord.MessageEmbed()
            .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
            .setColor("fcfcfc")
            .setDescription(`Successfully added \`${res.tracks[index].title}\` to the queue.`)

          if (player.queue.size === 0) {
            a.setFooter("This is the only song in the queue.")
          } else {
            a.setFooter(`The Queue Length is now ${player.queue.size}`)
          }

          return message.channel.send(a)
      }
    } catch (e) {
      console.log(e)
      functions.error(error, 'Play', message)
    }
  }
}