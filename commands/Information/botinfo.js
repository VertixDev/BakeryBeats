const Discord = require("discord.js");
let os = require("os");
let cpuStat = require("cpu-stat");
const { duration } = require("../../constants/functions")

module.exports = {
  name: "botinfo",
  aliases: ["info"],
  description: "Sends detailed info about the client",
  run: async (client, message, args) => {

    message.react("🔎")

    try {
      cpuStat.usagePercent(function (e, percent, seconds) {
        if (e) {
          return console.log(String(e.stack).red);
        }
        let connectedchannelsamount = 0;
        let guilds = client.guilds.cache.map((guild) => guild);
        for (let i = 0; i < guilds.length; i++) {
          if (guilds[i].me.voice.channel) connectedchannelsamount += 1;
        }
        const botinfo = new Discord.MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setTitle("__**Stats:**__")
          .setColor("fcfcfc")
          .addField("⏳ Memory Usage", `\`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/ ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB\``, true)
          .addField("⌚️ Uptime ", `\`${duration(client.uptime)}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Users", `\`${client.users.cache.size.toLocaleString()}\``, true)
          .addField("📁 Servers", `\`${client.guilds.cache.size.toLocaleString()}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("📁 Voice-Channels", `\`${client.channels.cache.filter((ch) => ch.type === "voice").size.toLocaleString()}\``, true)
          .addField("📁 Connected Channels", `\`${connectedchannelsamount.toLocaleString()}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("👾 Discord.js", `\`v${Discord.version}\``, true)
          .addField("🤖 Node", `\`${process.version}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("🤖 CPU", `\`\`\`md\n${os.cpus().map((i) => `${i.model}`)[0]}\`\`\``)
          .addField("🤖 CPU usage", `\`${percent.toFixed(2)}%\``, true)
          .addField("🤖 Arch", `\`${os.arch()}\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("💻 Platform", `\`\`${os.platform()}\`\``, true)
          .addField("🏓 API Latency", `\`${client.ws.ping}ms\``, true)
          .addField("\u200b", `\u200b`, true)
          .addField("➕ Invite", `[\`🎶\`](https://discord.com/oauth2/authorize?client_id=804430122668654593&scope=bot&permissions=271871320&redirect_uri=https%3A%2F%2Fdevnoah.me%2Fbakerybeats)`, true)
          .setFooter("Bakery Beats | Created by DevNoahh#0001");
        message.channel.send(botinfo);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new Discord.MessageEmbed()
        .setColor(`RED`)
        .setFooter("Bakery Beats", client.user.displayAvatarURL())
        .setTitle(`❌ | An error occurred while fetching the bot info.`)
        .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  },
};
