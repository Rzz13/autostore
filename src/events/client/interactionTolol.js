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
let client = require('../../index');
let { fs } = require("fs");

module.exports = {
  name: "Button Menu"
};

client.on("interactionCreate", async (interaction) => {
  const manuk = new ModalBuilder()
    .setCustomId("sammuh")
    .setTitle("Your Are In The Buying Menu");
  const lamusa = new TextInputBuilder()
    .setCustomId("kontol")
    .setLabel("Code Of Products:")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(10)
    .setMinLength(1)
    .setPlaceholder("Input Code Of Products Like You!")
    .setRequired(true);
  const rowdas = new ActionRowBuilder().addComponents(lamusa);
  manuk.addComponents(rowdas);

  const lamus = new TextInputBuilder()
    .setCustomId("summah")
    .setLabel("HowMany")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(3)
    .setMinLength(1)
    .setPlaceholder("HowMany You Want To Buy?")
    .setValue("1")
    .setRequired(true);
  const rowda = new ActionRowBuilder()
    .addComponents(lamus);
  manuk.addComponents(rowda);

  //Respons Growid
  const grow = new ModalBuilder()
    .setCustomId("growid1")
    .setTitle("Your Are In The Set Your GrowID");
  const a57 = new TextInputBuilder()
    .setCustomId("kontol")
    .setLabel("Input Your GrowID:")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(20)
    .setMinLength(3)
    .setPlaceholder("Input Your GrowID In Here And Make Sure It's Correct")
    .setRequired(true);
  const row23 = new ActionRowBuilder().addComponents(a57);
  grow.addComponents(row23);

  const asek = new TextInputBuilder()
    .setCustomId("confirm")
    .setLabel("Confirm Your GrowID:")
    .setStyle(TextInputStyle.Short)
    .setMaxLength(20)
    .setMinLength(3)
    .setPlaceholder("Input Same Like Above!")
    .setRequired(true);
  const slebew = new ActionRowBuilder().addComponents(asek);
  grow.addComponents(slebew);

  try {
    if (interaction.customId === "support") {
      if (interaction.values.includes("setGrowID")) {
        await interaction.showModal(grow);
      }
    }

    if (interaction.customId === "support") {
      if (interaction.values.includes("Howmanys")) {
        await interaction.showModal(manuk);
      }
    }

    if (interaction.customId === "Howmanys") {
      await interaction.showModal(manuk);
      //await interaction.showModal(a572);
    }

    if (interaction.customId === "growid23") {
      await interaction.showModal(grow);
    }

    if (interaction.customId === "growid21") {
      await interaction.showModal(grow);
    }
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: `Ada Error!`,
      ephemeral: true
    });
  }
})