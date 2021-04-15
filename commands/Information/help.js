const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const appRoot = require('app-root-path')
const { prefix } = require(appRoot + "/config/config.json")
const ms = require('ms')

module.exports = {
  name: "help",
  aliases : ['h'],
  permission: 0,
  description: "Shows all available bot commands.",
  run: async (client, message, args) => {


    const roleColor = "#fcfcfc"

    if (!args[0]) {
      let categories = [];

      readdirSync("./commands/").forEach((dir) => {
        const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
          file.endsWith(".js")
        );

        const cmds = commands.map((command) => {
          let file = require(`../../commands/${dir}/${command}`);

          if (!file.name) return

          let name = file.name.replace(".js", "");

          return `\`${name}\``;
        });

        let data = new Object();

        data = {
          name: dir,
          value: cmds.length === 0 ? "In progress." : cmds.join(" "),
        };

        categories.push(data);
      });


      const embed = new MessageEmbed()
        .setAuthor("Need help?", "https://i.imgur.com/Eb2ki9u.png")
        .setTitle("All of my commands are listed below!")
        .addFields(categories)
        .setDescription(
          `Use \`bb!help\` followed by a command name to get additional information on that command. For example: \`bb!help play\`.`
        )
        .setThumbnail("https://i.imgur.com/Eb2ki9u.png")
        .setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(roleColor);

      return message.channel.send(embed);
    } else {
      const command =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find(
          (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
        );

      if (!command) {
        const embed = new MessageEmbed()
          .setTitle(`That command was not found!`)
          .setDescription(`Use \`bb!help\`to get a list of all of my commands.`)
          .setColor("RED");
        return message.channel.send(embed);
      }

      const embed = new MessageEmbed()

        .setTitle("Command Details:")
        .addField(
          "Command:",
          command.name ? `\`${command.name}\`` : "This command cannot be ran."
        )

        if(command.aliases) {
            embed.addField(
                "Aliases:",
                `\`${command.aliases.join("` `")}\``
              )
        }
        
        if(command.timeout) {
        embed.addField(
          "Cooldown:", `\`${ms(command.timeout)}\``
        )
        }

        if(command.permission) {
          embed.addField(
            "Permission Level Requirement:",
            `\`${command.permission}\``
          )
          }

        if(command.description) {
        embed.addField(
          "Description:",
          `\`${command.description}\``
        )
        }

        embed.setFooter(
          `Requested by ${message.author.tag}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        embed.setTimestamp()
        embed.setColor(roleColor);
        embed.setThumbnail("https://i.imgur.com/Eb2ki9u.png")
      return message.channel.send(embed);
    }
  },
};