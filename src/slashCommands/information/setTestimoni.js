let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const testi = require("../../Schema/ctesti.js");
module.exports = {
    name: 'testimoni',
    description: "Set Channel Testi",
    ownerOnly: true,
    options: [
        {
            name: "channel",
            description: "Set Channel For Testimoni",
            type: ApplicationCommandOptionType.Channel,
            required: true
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const ChanelID = interaction.options.getChannel("channel");
        const user = interaction.user;
        await testi.findOneAndUpdate(
            {},
            { $set: { Chanel: ChanelID.id } },
            { upsert: true, new: true }
        )
            .then((res) => {
                console.log(res);
                const sendToOwner = new EmbedBuilder()
                .setTitle("Change Product Code History")
                .setDescription(
                    `
                    New Channel Testi: ${ChanelID}
                `.replace(/ {2,}/g, "")
                )
                .setTimestamp();
                user.send({ embeds: [sendToOwner] });
                interaction.reply({ content:`Succes Set Chanel Testimoni To **${ChanelID}**`, ephemeral: true });
            })
            .catch((e) => console.error(e));
    }
}