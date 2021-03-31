const Discord = require("discord.js")
const glob = require("glob")
const appRoot = require("app-root-path")
const { delay, reply } = require("../../constants/functions")

module.exports = {
  name: "reload",
  description: "Reload all commands to apply changes",
  run: async (client, message, args) => {

    await client.commands.sweep(() => true)
    message.react("✅")

    glob(`${appRoot + "/commands/**/*.js"}`, async (err, filePaths) => {
      if (err) return console.log(err)

      filePaths.forEach((file) => {
        delete require.cache[require.resolve(file)]

        const pull = require(file)

        if (pull.name) {
          client.commands.set(pull.name, pull)
          console.log(`✅ ${pull.name} reloaded.`)
        }

        if (pull.aliases && Array.isArray(pull.aliases)) {
          pull.aliases.forEach((alias) => {
            client.aliases.set(alias, pull.name)
          })
        }
      })

    })

    reply(client, message, `Reloaded all commands. Check console for any errors or to see the list of commands that were reloaded.`)


    setTimeout(() => {
      console.log(`==========================================`)
    }, 2500)
  }
}