const Discord = require("discord.js")
const { error } = require("../../constants/functions")

module.exports = {
    name: "announce",
    description: "Enable or Disable the announcing of Notifications, such as song changes, song skips, and more.",
    run: async (client, message, args) => {

        try {

            if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.reply("only people with the `MANAGE_NICKNAMES` permission can run configuration commands.")

            const a = client.db.get(`${message.guild.id}_announcements`)

            if (!a) {
                await client.db.set(`${message.guild.id}_announcements`, false)

                return message.channel.send("✅ | Announcements have successfully been disabled.")
            }

            if (a) {
                await client.db.delete(`${message.guild.id}_announcements`)

                return message.channel.send("✅ | Announcements have successfully been re-enabled.")
            }



        } catch (e) {
            error(e, "Announce", message)
        }

    }
}