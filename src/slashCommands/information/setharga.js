let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const list = require("../../Schema/list.js");
const Price = require("../../Schema/price.js");
let { COLOR } = require("../../config/config.json");
module.exports = {
    name: 'setprice',
    description: "Set Price For Product",
    ownerOnly: true,
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "price",
            description: "Howmany Price To Add In Product?",
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        let wut = interaction.options.getString("code");
        const user = interaction.user;
        const getCode = await list
            .findOne({ code: wut })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        if (!getCode) return interaction.reply({ content: "Code Not Found", ephemeral: true });

        let price = interaction.options.getNumber("price");

        await Price.findOneAndUpdate(
            { code: wut },
            { price: price, code: wut, role: wut },
            { upsert: true, new: true }
        )
            .then((res) => {
                interaction.reply({ content:
                    "Successfully Set " + res.code + " Price With Price " + res.price, ephemeral: true
                });
                const sendToOwner = new EmbedBuilder()
                    .setTitle("Price History")
                    .setDescription(
                        `
         Code: ${wut}
         New Price: ${price}
       `.replace(/ {2,}/g, "")
                    )
                    .setTimestamp()
                    .setColor(COLOR);
                user.send({ embeds: [sendToOwner] });
            })
            .catch(console.error);
    }
}