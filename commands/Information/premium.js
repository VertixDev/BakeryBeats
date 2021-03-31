const Discord = require("discord.js")
const { reply } = require("../../constants/functions.js")

module.exports = {
    name: "premium",
    description: "Check your Server's Premium Status",
    timeout: 2500,
    run: async (client, message, args) => {

        const premium = client.db.get(`${message.guild.id}_premium`)

        if(args[0]) {
            return reply(client, message, `More information about Premium is coming soon.`)
        }

        if (!premium) {
            return reply(client, message, `\`${message.guild.name}\` currently does **not** have Premium Enabled. \nInformation about how to obtain Server Premium will be released soon.`)
        }

        if(premium) {
            return reply(client, message, `\`${message.guild.name}\` currently **does** have Premium Enabled. Information about the features of Premium can be found by running \`bb!premium info\``)
        }
    }
}