const Discord = require("discord.js");

module.exports = {

  duration: function (ms) {
    const sec = Math.floor((ms / 1000) % 60).toString();
    const min = Math.floor((ms / (60 * 1000)) % 60).toString();
    const hrs = Math.floor((ms / (60 * 60 * 1000)) % 60).toString();
    const days = Math.floor((ms / (24 * 60 * 60 * 1000)) % 60).toString();
    return `${days} Days, ${hrs} hours, ${min} minutes, ${sec} seconds`;
  },

  delay: function (delayInms) {
    try {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(2);
        }, delayInms);
      });
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },

  format: function (millis) {
    try {
      var h = Math.floor(millis / 3600000),
        m = Math.floor(millis / 60000),
        s = ((millis % 60000) / 1000).toFixed(0);
      if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
      else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
    } catch (e) {
      console.log(String(e.stack).bgRed)
    }
  },

  error: function (errormsg, command, message) {
    try {

      let webhoook = new Discord.WebhookClient('821250368062619658', 'p3cZG5jPfswvKo4xI7PaVVaUITqwA3n1R8LIAHgUrTjbbDLeboxeml_AkGAiqzGvpXlI')
      const logEmbed = new Discord.MessageEmbed()
        .setColor("RED")
        .setAuthor("Bakery Beats", "https://i.imgur.com/Eb2ki9u.png")
        .setDescription(`\`${command}\` was ran by \`${message.author.username}\` \`(${message.author.id})\` but an error was thrown.`)
        .addField(`Error:`, `\`\`\`${errormsg}\`\`\``, true)
        .addField(`Guild:`, `\`\`\`${message.guild.name} \n(${message.guild.id})\`\`\``, true)
      webhoook.send(logEmbed)

      message.channel.send("An Error has occurred while running this command. Developers have been notified and this issue will be fixed as soon as possible.")

    } catch (e) {
      console.log(e)
    }
  },

  reply: function (client, message, text) {
    client.api.channels[message.channel.id].messages.post({
      data: {
        "content": `${text}`,
        "tts": false,
        message_reference: {
          message_id: message.id,
          guild_id: message.guild.id,
          channel_id: message.channel.id
        }
      }
    })
  },

}