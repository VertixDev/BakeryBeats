const beautify = require('beautify');
const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "eval",
  category: "Developer",
  description: "e",
  permission: 7,
  async run(client, message, args) {
    if (!["394245930288676865"].includes(message.author.id)) return; 

    if (args.length < 1) return message.channel.send("`Not enough parameters`");

    const bot = message.client,
      options = {
        split: {
          char: "\n",
          prepend: "`" + "``js\n",
          append: "`" + "``",
        },
      };

    const match = args[0].match(/--(depth)=(\d+)/);
    const depth = match && match[1] === "depth" ? parseInt(match[2]) : 0;

    const content = args.join(" ");
    const result = new Promise((resolve) => resolve(eval(content)));

    return result
      .then((output) => {
        if (typeof output !== "string")
          output = require("util").inspect(output, { depth });
        if (output.includes(message.client.token))
          output = output.replace(
            message.bot.token,
            "*You think I'm that idiotic Noah? Please...say no...*"
          );
        const embed = new MessageEmbed()
          .setAuthor(
            "Evaluation",
            bot.user.displayAvatarURL()
          )
          .setTitle("Evaluation")
          .setColor("#fcfcfc")
          .setDescription(
              "`" +
              "``js\n" +
              output +
              "`" +
              "``",
            options
          );
        message.channel.send(embed);
      })
      .catch((e) => {
        const embed1 = new MessageEmbed()
          .setTitle("Something happened while executing your code")
          .setColor("RED")
          .setDescription(`\`\`\`${e}\`\`\``)
        message.channel.send(embed1);

  },
)}}
