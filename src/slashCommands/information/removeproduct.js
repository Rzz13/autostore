let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const list = require("../../Schema/list.js");
let client = require('../../index.js');
let { Owner } = require('../../config/config.json');
module.exports = {
    name: 'removeproduct',
    description: "Remove Product From Stock List",
    ownerOnly: true,
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const code = interaction.options.getString("code");
        let user = interaction.user;

        const getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .then((res) => {
                return res;
            })
            .catch(console.error);
        if (!getCode) {
            interaction.reply({
                content:"Product With That Code Doesnt Exist",
                ephemeral: true
            });
        } else {
            await list
                .deleteOne({ code: interaction.options.getString("code") })
                .then((d) => {
                    interaction.reply({
                        content:"Product Removed",
                        ephemeral: true
                    });
                })
                .catch(console.error);
            const sendToOwner = new EmbedBuilder()
                .setTitle("Removed Product History")
                .setDescription(
                    `
         Code: ${code}
       `.replace(/ {2,}/g, "")
                )
                .setTimestamp();
            user.send({ embeds: [sendToOwner] });
        }
    }
}