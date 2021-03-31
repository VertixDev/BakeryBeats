const Discord = require("discord.js")

module.exports = {
   name: "dj",
   description: "Set the Guild to DJ Only Mode or Disable DJ Only Mode",
   run: async (client, message, args) => {



      if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply("Only users with the `Manage Nicknames` Permission can edit the DJ setting.")

      if (!args[0]) {

         if (client.db.get(`${message.guild.id}_dj`) === true) {
            return message.channel.send(new Discord.MessageEmbed()
               .setAuthor("Bakery Beats", client.user.displayAvatarURL())
               .setDescription(`DJ Only Mode is currently \`enabled\` for \`${message.guild.name}\``)
               .setColor("fcfcfc")
               .setFooter("To enable or disable DJ mode, run bb!dj <enable/disable>")
            )
         }

         else if (!client.db.get(`${message.guild.id}_dj`)) {
            return message.channel.send(new Discord.MessageEmbed()
               .setAuthor("Bakery Beats", client.user.displayAvatarURL())
               .setDescription(`DJ Only Mode is currently \`disabled\` for \`${message.guild.name}\``)
               .setColor("fcfcfc")
               .setFooter("To enable or disable DJ mode, run bb!dj <enable/disable>")
            )
         }
      }

      else if (args[0] === "enable") {
         client.db.set(`${message.guild.id}_dj`, true)
         return message.channel.send(`DJ only mode has been enabled for this server. \nMake sure users who you want to control the Music have either a role called \`DJ\` or they have the \`Manage Nicknames\` Permission.`)
      }

      else if (args[0] === "disable") {
         client.db.delete(`${message.guild.id}_dj`)
         return message.channel.send(`DJ only mode has been disabled for this server. \nNormal Members can now use the bot without permissions.`)
      }

   }
}