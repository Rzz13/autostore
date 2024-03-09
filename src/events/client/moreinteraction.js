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
const client = require('../../index.js');
const mt = require("../../Schema/mt.js")
let Bal = require("../../Schema/balance.js");
let Bals = require("../../Schema/infogrowid.js");
let depo = require("../../Schema/depo.js");
let { WL } = require("../../config/config.json");
let dl = require("../../Schema/dl.js");
let list = require("../../Schema/list.js");
let shop = require("../../Schema/shop.js");
let Price = require("../../Schema/price.js");

module.exports = {
  name: "Interaction Of Button"
};

client.on("interactionCreate", async (interaction) => {
  if (interaction.customId === "support") {
    if (interaction.values.includes("stock")) {
      const getCodes = await list
        .find({})
        .then((res) => {
          return res;
        })
        .catch(console.error);
      if (getCodes.length < 1) return;
      let text = "";
      for (let i = 0; i < getCodes.length; i++) {
        const code = getCodes[i];
        const stock = await shop
          .find({ code: code.code })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        const price = await Price.findOne({ code: code.code })
          .then((res) => {
            return res;
          })
          .catch(console.error);
        text += `
          **${code.name}**
          - Code: **${code.code}**
          - Stock: **${stock.length > 0 ? stock.length : "0"}**
          - Price: **${price ? price.price : "Not Set Yet"} World Locks**
          `.replace(/ {2,}/g, "");
      }
      const embed = new EmbedBuilder()
        .setTitle(`PRODUCT LIST`)
        /*.setAuthor({
      name: `TICKET`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    })*/
        .setDescription(`${text}`)
        .setTimestamp()

        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Set GrowID")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:Bot:1170169208273903677>")
          .setCustomId("growid21"),
        new ButtonBuilder()
          .setLabel("Balance")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<a:dollarfire:1174338459113103451>")
          .setCustomId("balance1"),
        new ButtonBuilder()
          .setLabel("Deposit")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<a:world:1174338186189733899>")
          .setCustomId("deposit"),
        new ButtonBuilder()
          .setLabel("Buy")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:duit:1170172864465473588>")
          .setCustomId("Howmanys")
      );
      interaction
        .reply({ embeds: [embed], components: [row2], ephemeral: true })
        .then(console.log("Ticket Sent to interaction Channel"))
        .catch(console.error);
    }
    if (interaction.values.includes("balance1")) {
      let user = interaction.user.id;
      const row6000 = new ActionRowBuilder().addComponents(
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
      if (!user)
        return interaction.reply({
          content:
            "Can't Find DiscordID Registered With That GrowID",
          components: [row6000],
          ephemeral: true,
        });

      let wallet1 = await Bal.findOne({ DiscordID: user })
        .then((d) => {
          return d;
        })
        .catch((e) => console.error(e));

      let wallets = await Bals.findOne({ DiscordID: user })
        .then((d) => {
          return d;
        })
        .catch((e) => console.error(e));

      if (wallet1 && wallets) {
        const embed = new EmbedBuilder()
          .setTitle(`${interaction.user.username}'s Balance`)
          .setDescription(
            `- **GrowID: ${wallet1.GrowID}**\n- **Balance: ${wallet1.Balance} ${WL}**`
          )
          .setTimestamp()

          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Deposit")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("<a:world:1174338186189733899>")
            .setCustomId("deposit"),
          new ButtonBuilder()
            .setLabel("Stock")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("<:history:1156560248023285881>")
            .setCustomId("stock87"),
          new ButtonBuilder()
            .setLabel("Buy")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("<:duit:1170172864465473588>")
            .setCustomId("Howmanys")
        );
        interaction
          .reply({ embeds: [embed], components: [row2], ephemeral: true })
          .then(console.log("Ticket Sent to interaction Channel"));
      } else {
        await interaction.reply({
          content:
            "The user with the GrowID you provided or the tagged user was not found",
          components: [row6000],
          ephemeral: true,
      });
      }
    }
    if (interaction.values.includes("deposit")) {
      const deposit = await depo
        .findOne({})
        .then((d) => {
          console.log(d);
          return d;
        })
        .catch((e) => console.error(e));
      const rateDl = await dl
        .findOne({})
        .then((res) => {
          return res?.Rate;
        })
        .catch(console.error);

      const embed = new EmbedBuilder()
        .setTitle(`DEPOSIT WORLD`)
        /*.setAuthor({
      name: `TICKET`,
      iconURL: interaction.guild.iconURL({ dynamic: true }),
    })*/
        .setDescription(
          " World: **" +
          (deposit?.world ? deposit.world : "Not Set Yet") +
          "**\n" +
          " Owner: **" +
          (deposit?.owner ? deposit.owner : "Not Set Yet") +
          "**\n" +
          " Bot Name: **" +
          (deposit?.botName ? deposit.botName : "Not Set Yet") +
          "**"
        )
        .setTimestamp()

        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));

      const row2 = new ActionRowBuilder().addComponents(
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
          .setLabel("Buy")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("<:duit:1170172864465473588>")
          .setCustomId("Howmanys")
      );
      interaction
        .reply({ embeds: [embed], components: [row2], ephemeral: true })
        .then(console.log("Ticket Sent to interaction Channel"));
    }
  }
})