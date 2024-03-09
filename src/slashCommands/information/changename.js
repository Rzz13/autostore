let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const list = require("../../Schema/list.js");
module.exports = {
    name: 'changename',
    description: "Change Name Of Product",
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
            description: "New Name For Product",
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
        const productName = interaction.options.getString("name");
        let user = interaction.user;

        const getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .catch(console.error);


        if (!getCode) return interaction.reply({ content: "Product With That Code Doesn't Exist", ephemeral: true });

        await list
            .updateOne(
                {
                    code: interaction.options.getString("code"),
                },
                {
                    name: productName,
                }
            )
            .then((d) => {
                interaction.reply({ content: "Product Name Changed", ephemeral: true });
                const sendToOwner = new EmbedBuilder()
                    .setTitle("Change Name History")
                    .setDescription(
                        `
                        New Name: ${productName}
                        `
                            .replace(/ {2,}/g, "")
                    )
                    .setTimestamp();
                user.send({ embeds: [sendToOwner] });
            })
            .catch(console.error);
    }
}