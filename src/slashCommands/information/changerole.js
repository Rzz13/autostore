let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const list = require("../../Schema/list.js");
module.exports = {
    name: 'changerole',
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
        const productRoles = interaction.options.getRole("role");
        const productRole = productRoles.id;
        const user = interaction.user;

        const getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .catch(console.error);

        if (!getCode) return interaction.reply({ content: `Message Reply Code Doesnt Exit`, ephemeral: true })

        await list
            .findOneAndUpdate(
                {
                    code: interaction.options.getString("code"),
                },
                {
                    role: productRole,
                }
            )
            .then((d) => {
                interaction.reply({ content: `Role Changed To ${productRoles}`, ephemeral: true });
                const sendToOwner = new EmbedBuilder()
                    .setTitle("Change Product Role History")
                    .setDescription(
                        `
                    New Role: ${productRole}
                `.replace(/ {2,}/g, "")
                    )
                    .setTimestamp();
                user.send({ embeds: [sendToOwner] });
            })
            .catch(console.error);
    }
}