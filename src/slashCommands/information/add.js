let {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");
const { Client, CommandInteraction, AttachmentBuilder, ApplicationCommandOptionType, ChannelType } = require('discord.js');
let list = require("../../Schema/list.js");
let shop = require("../../Schema/shop.js");
const request = require("request");
const { OWNER, Admin, WL, COLOR } = require("../../config/config.json");
module.exports = {
    name: 'additem',
    description: "add Item For Stock",
    ownerOnly: true,
    options: [
        {
            name: "code",
            description: "What Code For Add Stock?",
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: "item",
            description: "Write Data",
            type: ApplicationCommandOptionType.String,
            required: false
        },
        {
            name: "file",
            description: "Upload Your file",
            type: ApplicationCommandOptionType.Attachment,
            required: false
        }
    ],
    /** 
     * @param {Client} client 
     * @param {CommandInteraction} interaction
     * @param {String[]} args 
     */
    run: async (client, interaction, args) => {
        const itemo = interaction.options.getString("item");
        const filo = interaction.options.getAttachment("file");
        const code = interaction.options.getString("code");
        const getCode = await list
            .findOne({ code: interaction.options.getString("code") })
            .catch(console.error);

        const lah = await interaction.reply({
            content: `Just Wait`,
            ephemeral: true
        });

        if (!getCode) return lah.edit({ content: `Wrong Code`, ephemeral: true });

        /*if (itemo) {
            let items = interaction.options.getString("item").split(' ');
            items.forEach(async (item) => {
                await new shop({
                    code: code,
                    data: item,
                })
                    .save()
                    .then((d) => {
                        console.log(d);
                        lah.edit({
                            content: `Items Added`,
                            ephemeral: true
                        });
                    })
                    .catch(console.error);
            })
        }*/
        if ( filo && itemo ) return lah.edit({
            content:`Pilih Salah Satu Options SAJA`,
            ephemeral: true
        });
        try {
            if (filo) {
                const filos = interaction.options.getAttachment("file");
                if (code.includes("script")) {
                    request(filos.url, async (err, res, body) => {
                        if (err) return console.error(err);
                        const script = body;
                        await new shop({
                            code: code,
                            data: script,
                        })
                            .save()
                            .then((d) => {
                                console.log(d);
                                lah.edit({
                                    content: `Successfully Added Script Into Database`,
                                    ephemeral: true
                                });
                            })
                            .catch(console.error);
                    });
                } else {
                    request(filos.url, async (err, res, body) => {
                        if (err) return console.error(err);
                        const items = body.split(/[\n\r\s]+/);
                        if (items.length == 0) return lah.edit({ content:`No Item In This File!`, ephemeral: true })
                        for (let item of items) {
                            await new shop({
                                code: code,
                                data: item,
                            })
                                .save()
                                .then((d) => {
                                    console.log(d);
                                    lah.edit({
                                        content: `Write File Succesffully`,
                                        ephemeral: true
                                    });
                                })
                                .catch(console.error);
                        }
                    });
                }
            } else {
                let items = interaction.options.getString("item").split(' ');
                items.forEach(async (item) => {
                    await new shop({
                        code: code,
                        data: item,
                    })
                        .save()
                        .then((d) => {
                            console.log(d);
                            lah.edit({
                                content: `Items Added`,
                                ephemeral: true
                            });
                        })
                        .catch(console.error);
                })
            }
        } catch (error) {
            console.error(error);
            lah.edit({
                content: `Ada Yang Salah!`,
                ephemeral: true
            });
        }
    }
}