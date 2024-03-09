let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const depo = require("../../Schema/depo.js")
let { COLOR } = require("../../config/config.json");
module.exports = {
    name: 'setdepo',
    description: "Set World Deposit",
    ownerOnly: true,
    options: [
        {
            name: "world",
            description: "World Deposit",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "owner",
            description: "Nama Owner World Depo",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "botname",
            description: "Name Of Bot Depo",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "saweria",
            description: "Link Saweria",
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const world = interaction.options.getString("world");
        const owner = interaction.options.getString("owner");
        const botName = interaction.options.getString("botname");
        const saweris = interaction.options.getString("saweria");
        const saweria = saweris ? saweris : "No Set"
        const user = interaction.user;
        depo
            .findOneAndUpdate(
                { world: { $exists: true } },
                {
                    $set: {
                        world: world,
                        owner: owner,
                        botName: botName,
                        saweria: saweria,
                    },
                },
                { upsert: true, new: true }
            )
            .then((d) => {
                console.log(d);
                interaction.reply({ content:"Done Set World Depo", ephemeral: true });
                const sendToOwner = new EmbedBuilder()
                    .setTitle("World Depo History")
                    .setDescription(
                        `
         New World: ${world}
         New Owner: ${owner}
         New Bor Name: ${botName}
       `.replace(/ {2,}/g, "")
                    )
                    .setTimestamp()
                    .setColor(COLOR);
                user.send({ embeds: [sendToOwner] });
            })
            .catch((e) => console.error(e));
    }
}