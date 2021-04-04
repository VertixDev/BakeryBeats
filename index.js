/* 

    COPYRIGHT DEVNOAH 2020 DUCKY DEVELOPMENT

    License: You may not copy, distribute and modify the software as long as you track changes/dates in source files.
     Any modifications to or software including (via compiler) GPL-licensed code must also be made available under the GPL along with build & install instructions.

    AUTHORS: DevNoah, Zeekz

*/

const config = require("./config/config.json");
const Discord = require("discord.js");
require('discord-reply');

const client = new Discord.Client({
    fetchAllMembers: false,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
});

const fs = require("fs");
const mongoose = require('mongoose')
const prefix = config.prefix
const enmap = require('enmap');
const { Manager } = require("erela.js");
const message = require("./events/message");
const AutoPoster = require("topgg-autoposter")

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.prefix = prefix;

this.botURL = "https://i.imgur.com/Eb2ki9u.png"

client.manager = new Manager({
    nodes: [{
        host: "144.172.67.137",
        port: 4500,
        password: "youshallnotpass",
        retryDelay: 5000,
    },
        // {
        //     host: "lava2.danbot.host",
        //     port: 2333,
        //     password: "DBH",
        //     retryDelay: 5000,
        // }
    ],
    autoPlay: true,
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
    }
})

AutoPoster(config.topggToken, client)

client.on("raw", d => client.manager.updateVoiceState(d));

//<!----Enmap---->

client.db = new enmap({
    name: "db",
    autoFetch: true,
    cloneLevel: "deep",
    fetchAll: true
});


//<!----Enmap---->


client.on("ready", () => {
    require('./handlers/command.js')(client)
})

client.once('ready', async () => {
    console.log(`${client.user.tag} is now online and watching over ${client.guilds.cache.size} guilds and ${client.users.cache.size} users.`)
    client.manager.init(client.user.id);

})

//client.on("debug", (e) => console.info(e));

client.on("ready", async () => {
    await enmap.defer;
    console.log("Enmap DB Connected");
})


client.on('ready', () => {
    setInterval(() => {
        var status = [{
            text: `Vertix Studios`,
            type: `WATCHING`
        },
        {
            text: `devnoah.me/bakerybeats`,
            type: `PLAYING`
        },
        {
            text: `over ${client.guilds.cache.size} Servers!`,
            type: `WATCHING`
        },
        {
            text: `${client.manager.players.size} active players.`,
            type: `LISTENING`
        },
        ]
        var s = status[Math.floor(Math.random() * status.length)]

        client.user.setActivity(s.text, { type: s.type, })
    }, 15000)
})

client.on('message', async (message) => {
    message.member; //-- GuildMember based
    message.author; //-- User based
    require("./events/message.js")(client, message);
})

client.on('voiceStateUpdate', (oldState, newState) => {
    if (oldState.id !== '804430122668654593') return
    if (oldState.channel !== null && newState.channel === null) {
        var ifPlayer = client.manager.get(newState.guild.id);
        if (!ifPlayer) return
        if (ifPlayer.guild !== oldState.guild.id) return
        else client.channels.cache.get(ifPlayer.textChannel).send("The Player has stopped since the bot has been disconnected by an Administrator.")
        ifPlayer.destroy()
    }
});


client.manager.on("nodeConnect", node => {
    console.log(`Node "${node.options.identifier}" connected.`)
})

client.manager
    .on("nodeConnect", (node) => console.log(`Node "${node.options.identifier}" connected.`))
    .on("nodeError", (node, error) => console.log(
        `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {

        if (player.trackRepeat || player.queueRepeat) return
        if (client.db.get(`${player.guild}_announcements`) === false) return
        const b = client.channels.cache.get(player.textChannel)
        const embed = new Discord.MessageEmbed()
            .setDescription(`Now playing: [\`${track.title}\`](${track.uri})`)
            .setAuthor("Bakery Beats", client.user.displayAvatarURL())
            .setColor("fcfcfc")
        embed.setFooter(`View the current queue by running bb!queue`)

        return b.send(embed)
    })
    .on("queueEnd", player => {
        const channel = client.channels.cache.get(player.textChannel)

        const qEmbed = new Discord.MessageEmbed()
            .setDescription("The Queue has ended. \nYou can request more songs with `bb!play <song/song url>`.")
            .setColor(`fcfcfc`)
            .setAuthor("Bakery Beats", client.user.displayAvatarURL())
            .setFooter("Bakery Beats will Automatically Disconnect if the Queue stays empty for longer than 60 seconds.")
        channel.send(qEmbed).then((p) => {
            setTimeout(() => {
                if (!player.playing && !player.paused) {
                    player.destroy()
                    p.delete()
                    channel.send("The Player has Stopped as the queue has been empty for longer than 60 seconds.")
                }
            }, 60000)
        })
    })
    .on("trackStuck", (player, track, payload) => {
        const channel = client.channels.cache.get(player.textChannel)
        channel.send(`${track.title} got stuck while playing. The Song has been skipped.`)
        player.stop()
        console.log(payload)
    })

    .on("playerCreate", async (player) => {
        player.setVolume(50);
    })




client.login(config.token);

