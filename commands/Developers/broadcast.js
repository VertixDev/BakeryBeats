const Discord = require("discord.js")

module.exports = {
    name: "broadcast",
    description: "Broadcasts a message to every Guild that has a Player Actively playing audio.",
    aliases: ["bc"],
    run: async(client, message, args) => {

        if(message.author.id !== "394245930288676865") return message.channel.send("This command is limited to Developers only.")

        client.manager.players.map((b) => {
            client.channels.cache.get(b.textChannel).send(args.slice(0).join(" "))
         }).then(() => {
             message.channel.send("Broadcast successfully sent.")
         }).catch(() => message.channel.send("Broadcast encountered an error. Logged to console."))
         
 
    }
}