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
    name: 'addproduct',
    description: "Change Role Of Product",
    ownerOnly: true,
    options: [
        {
            name: "code",
            description: "Code Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "name",
            description: "Name Of Product",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "role",
            description: "Tag Role For Change Role",
            type: ApplicationCommandOptionType.Role,
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
        const productName = interaction.options.getString("name");
        const Role = interaction.options.getRole("role");
        const user = interaction.user;

        const getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .then((res) => {
                return res;
            })
            .catch(console.error);
        console.log(getCode);

        if (getCode) return interaction.reply({ content: `Product Code Already Exits`, ephemeral: true });

        await new list({
            code: interaction.options.getString("code"),
            name: productName,
            role: Role.id,
        })
            .save()
            .then((d) => {
                interaction.reply({ content: `Product Was Added`, ephemeral: true });
            })
            .catch((e) => console.error(e));
        console.log(Role.id);

        const sendToOwner = new EmbedBuilder()
            .setTitle("Adding Product History")
            .setDescription(
                `
         Code: ${code}
         Name: ${productName}
         Role: ${Role}
       `.replace(/ {2,}/g, "")
            )
            .setTimestamp();
        user.send({ embeds: [sendToOwner] });
    }
}