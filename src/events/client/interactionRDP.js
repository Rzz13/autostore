let { WL, imageUrl, Owner, COLOR, ARROW } = require("../../config/config.json");
let {
    GatewayIntentBits,
    Client,
    Collection,
    InteractionType,
    ModalBuilder,
    StringSelectMenuBuilder,
    TextInputBuilder,
    ButtonStyle,
    ActionRowBuilder,
    EmbedBuilder,
    TextInputStyle,
    ButtonBuilder,
    ChannelType,
    PermissionsBitField,
    MessageCollector,
    Message,
} = require("discord.js");
let Bal = require("../../Schema/balance.js");
let shop = require("../../Schema/shop.js");
let list = require("../../Schema/list.js");
let Price = require("../../Schema/price.js");
let order = require("../../Schema/order.js");
let { MessageEmbed } = require("discord.js");
let ctesti = require("../../Schema/ctesti.js");
let client = require('../../index.js');
let { fs } = require("fs");

module.exports = {
    name: "Buying Item Of Menu"
};

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "sammuh") {
        if (interaction.type !== InteractionType.ModalSubmit) return;
        const Reason = interaction.fields.getTextInputValue("summah");
        let item = interaction.fields.getTextInputValue("kontol");

        let getCode = await list
            .findOne({ code: item })
            .then((res) => {
                return res;
            })
            .catch(console.error);
        if (!getCode)
            return interaction.reply({ content: "Code Not Found", ephemeral: true });
        let howmuch = Reason;
        if (howmuch < 1)
            return interaction.reply({
                content: "Are You Know? Dick",
                ephemeral: true,
            });
        if (isNaN(howmuch))
            return interaction.reply({
                content: "Only Use Number For Amount",
                ephemeral: true,
            });
        let user = interaction.user;
        let userars = await client.users.fetch(Owner);
        let member = interaction.guild.members.cache.get(user.id);
        let row6050 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Set GrowID")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:Bot:1170169208273903677>")
                .setCustomId("growid23"),
            new ButtonBuilder()
                .setLabel("Deposit")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<a:world:1174338186189733899>")
                .setCustomId("deposit")
        );
        let getBal = await Bal.findOne({ DiscordID: user.id })
            .then((d) => {
                //console.log(d);
                return d;
            })
            .catch((e) => console.error(e));
        if (!getBal)
            return interaction.reply({
                content: "Register First Before Using This Command!",
                components: [row6050],
                ephemeral: true,
            });
        let wallet = getBal.Balance;
        let price = await Price.findOne({ code: item })
            .then((d) => {
                //console.log(d);
                return d?.price;
            })
            .catch((e) => console.error(e));
        if (!price)
            return interaction.reply({
                content: "Tag Owner To Set Price For " + item,
                ephemeral: true,
            });

        let data = await shop
            .find({ code: item })
            .then((res) => {
                return res;
            })
            .catch(console.error);

        //console.log(price);

        let row645 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel("Balance")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<a:dollarfire:1174338459113103451>")
                .setCustomId("balance1"),
            new ButtonBuilder()
                .setLabel("Stock")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<:history:1156560248023285881>")
                .setCustomId("stock87"),
            new ButtonBuilder()
                .setLabel("Deposit")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("<a:world:1174338186189733899>")
                .setCustomId("deposit")
        );

        if (data.length == 0)
            return interaction.reply({
                content: "No Stock Yet",
                components: [row645],
                ephemeral: true,
            });
        //console.log("Amount :", howmuch);
        //console.log("Stock :", data.length);
        if (Number(data.length) < Number(howmuch))
            return interaction.reply({
                content: "Not That Much Stock",
                components: [row645],
                ephemeral: true,
            });
        price = Number(price) * Number(howmuch);
        //console.log(price);
        if (wallet < price)
            return interaction.reply({
                content: "Ur Money Is Less, The Price Is " + price,
                components: [row645],
                ephemeral: true,
            });
        let sending = "";
        const jumpa = await interaction.reply({
            content: "Process <a:processing:1174673702726680637>",
            components: [row645],
            ephemeral: true,
        });
        if (!item.includes("script")) {
            for (let i = 0; i < howmuch; i++) {
                let send = await shop
                    .findOneAndDelete({ code: item })
                    .then((res) => {
                        return res;
                    })
                    .catch(console.error);
                sending += send.data + "\n";
            }
        } else {
            let send = await shop
                .findOne({ code: item })
                .then((res) => {
                    return res;
                })
                .catch(console.error);
            sending += send.data;
        }
        try {
            let doneBuy = new EmbedBuilder()
                .setTitle("Purchase was Successfull")
                .setDescription(
                    "Purchase was successfull\nYou've successfully purchased " +
                    item +
                    " for " +
                    price +
                    WL +
                    "\ndon't forget to give reps, thanks"
                );

            user.send({
                content: "This Is Ur Order\n# NO REPS NO WARRANTY",
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: "Order.txt",
                    },
                ],
                embeds: [doneBuy],
            });
            userars.send({
                content: "This Is <@" + interaction.user.id + "> Order",
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: "Ur Order.txt",
                    },
                ],
            });
            jumpa.edit({
                content: "Check Ur DM",
                components: [row645],
                ephemeral: true,
            });
        } catch (erorr) {
            console.error("Gagal Mengirim Pesan: ", erorr);
            jumpa.edit({
                content:
                    "Did you turn off DM? if Yes u can dm Owner, if he is good maybe will be given your order :):",
                ephemeral: true,
            });
            user.send({
                content: "This Is Error <@" + interaction.user.id + "> Order",
                files: [
                    {
                        attachment: Buffer.from(sending),
                        name: "Ur Order.txt",
                    },
                ],
            });
        }
        await Bal.updateOne(
            { DiscordID: user.id },
            { $inc: { Balance: -Number(price) } }
        )
            .then((d) => {
                //console.log(d);
            })
            .catch((e) => console.error(e));

        //let ytta = "1101671633049112609";
        /*let Ytta = await list
        .findOne({ role: ytta })
        .then((res) => {
          return res?.role;
        });*/

        let Ytta = await list.findOne({ code: item }).then((res) => {
            return res?.role;
        });
        //console.log(Ytta);

        if (!member.roles.cache.some((r) => r.id == Ytta)) {
            member.roles.add(Ytta);
        }

        let orderN = await order
            .findOneAndUpdate(
                {},
                { $inc: { Order: 1 } },
                { upsert: true, new: true }
            )
            .then((d) => {
                return d?.Order;
            })
            .catch(console.error);
        if (!orderN) orderN = 1;
        let itemName = await list
            .findOne({ code: item })
            .then((res) => {
                return res?.name;
            })
            .catch(console.error);
        let testi = new EmbedBuilder()
            .setTitle("#Order Number: " + orderN)
            .setDescription(
                ARROW +
                "Pembeli: **<@" +
                user.id +
                ">**\n" +
                ARROW +
                "Produk: **" +
                howmuch +
                " " +
                (itemName || "IDK Name") +
                "**\n" +
                ARROW +
                " Total Price: **" +
                price +
                WL +
                " **\n**Thanks For Purchasing Our Product**"
            )
            .setColor(COLOR)
            .setTimestamp()
            .setImage(imageUrl);

        let chaneltesti = await ctesti
            .findOne({})
            .then((d) => {
                //console.log(d);
                return d.Chanel;
            })
            .catch((e) => console.error(e));
        let ch = interaction.guild.channels.cache.get(chaneltesti);

        if (!chaneltesti)
            return interaction.reply({
                content: "Channel Testimoni Not Set Now!!!!",
                ephemeral: true,
            });

        await ch.send({ embeds: [testi] });
        let sendToOwner = new EmbedBuilder()
            .setTitle("Purchase History")
            .setDescription(
                `
           Buyer: ${interaction.user.id?.toString()
                        ? interaction.user.id.toString()
                        : interaction.user.id
                    }
           Item: ${item}
           Amount: ${howmuch}
         `.replace(/ {2,}/g, "")
            )
            .setColor(COLOR)
            .setTimestamp();
        userars.send({ embeds: [sendToOwner] });

        /*let embed = new EmbedBuilder()
          .setTitle(`${username}'s Balance`)
          .setuser({
          name: `TICKET`,
          iconURL: interaction.guild.iconURL({ dynamic: true }),
        })
          .setDescription(
            `- **GrowID: ${wallet1.GrowID}**\n\n- **Lock: ${wallet1.Balance} ${WL}**\n- **Saldo: Rp ${wallet1.BalanceRp} <:duet:1165502017402327051>**`
          )
          .setTimestamp()
  
          .setThumbnail(interaction.guild.iconURL({ dynamic: true }));
  
        let row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Deposit")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("🌏")
            .setCustomId("deposit"),
          new ButtonBuilder()
            .setLabel("Buy")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("💳")
            .setCustomId("sil")
        );
        interaction
          .reply({ embeds: [embed], components: [row2], ephemeral: true })
          .then(//console.log("Ticket Sent to interaction Channel"));*/
    }
})