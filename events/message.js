const { MessageEmbed, WebhookClient } = require('discord.js');
const Discord = require("discord.js")
const appRoot = require('app-root-path')
const { prefix } = require(appRoot + '/config/config.json');
const humanizeDuration = require('humanize-duration')
const shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
        shortEn: {
            y: () => 'y',
            mo: () => 'm',
            w: () => 'w',
            d: () => 'd',
            h: () => 'h',
            m: () => 'm',
            s: () => 's',
            ms: () => 'ms',
        },
    },
});

const ms = require('ms');
const Timeout = new Map()


module.exports = async (client, message) => {

    if (message.author.bot) return

    if (message.channel.type === "dm") return;

    if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) return message.channel.send(new MessageEmbed()
        .setAuthor("Bakery Beats", client.user.displayAvatarURL())
        .setDescription("Hey! What's up! I'm **Bakery Beats**, an all-in-one Discord Music Bot! \nMy Prefix is currently `bb!`.\nYou can view my commands by running `bb!help`. \nView more info about me by clicking [here](https://devnoah.me/bakerybeats)")
        .setColor("fcfcfc")
    )

    if (!message.content.toLowerCase().startsWith(prefix)) return;

    if (!message.member) message.member = await message.guild.fetchMember(message);
    if (!message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    if (!command) return;


    let webhoook = new WebhookClient('819464562331877376', 'AgONAwvPxunmZcNJAgld303PyvWYD-3DeV6WuNGQtvnpCK-l3C-CgWWbiQAqXjUfY_CK')
    const logEmbed = new Discord.MessageEmbed()
        .setAuthor('Bakery Beats Logging', client.user.displayAvatarURL())
        .addField(`General Information`, `${message.author.username} (\`${message.author.id}\`) ran command: \`${command.name}\`.`)
        .addField(`Guild Information`, `\`${message.guild.name}\` (\`${message.guild.id}\`)`)
        .setColor("fcfcfc")

    args.join(" ") ? logEmbed.addField(`Arguments:`, `\`${args.join(" ")}\``) :

        logEmbed.setColor("#fcfcfc")
    webhoook.send(logEmbed)

    const isMaintenance = client.db.get(`maintenanceMode`)

    if (isMaintenance === true && message.author.id !== '394245930288676865') return message.channel.send(new MessageEmbed()
        .setAuthor("Bakery Beats Maintenance", client.user.displayAvatarURL())
        .setColor("fcfcfc")
        .addField("What does this mean?", `Bakery Beats is currently in Maintenance Mode. This means that no commands can be ran, and all Players have temporarily been disabled. Maintenance normally lasts for a couple of minutes, but times may vary. View the below notes for more information.`)
        .addField("Notes:", `\`DevNoahh#0001\`: There is an issue causing Music to lag extremely hard while the player is active. Developers are looking into this issue.`)
    )

    else {

        if (!command.timeout) {
            return command.run(client, message, args);
        }

        const key = message.author.id + command.name;
        const found = Timeout.get(key);
        const timeout = command.timeout;


        // var isDJ = client.db.get(`${message.guild.id}_dj`)

        // if (command.music === true && isDJ === true) {
        //     if (!message.member.hasPermission("MANAGE_NICKNAMES") || !message.member.roles.cache.some(role => role.name === 'DJ')) {
        //         return message.channel.send(new MessageEmbed()
        //             .setAuthor("Bakery Beats", client.user.displayAvatarURL())
        //             .setDescription(`${message.author}, this server currently has DJ Mode enabled. This requires users who want to control the Music, have either a role called \`DJ\` or have the \`Manage Nicknames\` Permission.`)
        //             .setColor("fcfcfc"))
        //     }

        // }

        if (found) {
            const timePassed = Date.now() - found;
            const timeLeft = timeout - timePassed;
            const embed = new MessageEmbed()
                .setAuthor('Cooldown Alert', client.user.displayAvatarURL())
                .setColor('#fcfcfc')
                .setDescription(`⏱ Woah there! You are currently on **Command Cooldown**\nYou can only use this command every **${ms(command.timeout)}** \nPlease wait **${humanizeDuration(timeLeft, { maxDecimalPoints: 1 })}**`)
                .setFooter(message.author.username, message.author.displayAvatarURL())
            message.channel.send(embed)
        } else {
            command.run(client, message, args);
            Timeout.set(key, Date.now());

            setTimeout(() => {
                Timeout.delete(key);
            }, command.timeout);
        }

    }

}
