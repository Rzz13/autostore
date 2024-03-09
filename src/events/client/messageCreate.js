const { PermissionsBitField, EmbedBuilder, MessageEmbed } = require('discord.js');
const client = require('../../index');
const Bal = require("../../Schema/balance.js");
const { WL, ChannelDonationLog } = require("../../config/config.json");

module.exports = {
    name: "Catch Of Donation Embeds"
};

client.on("messageCreate", async (message) => {
    if (ChannelDonationLog.includes(message.channel.id)) {
        if (message.embeds.length > 0) {
            const description = message.embeds[0].description;
            const GrowIDs = description.match(/GrowID: (\w+)/);
            const Deposit = description.match(/Amount: (\d+) (\w+)/);

            if (GrowIDs && Deposit) {
                const growId = GrowIDs[1];
                const growIds = growId.toLowerCase();
                const depo = parseInt(Deposit[1]);
                const item = Deposit[2];

                const itemvalue = {
                    "WorldLock": 1,
                    "DiamondLock": 100,
                    "BlueGemLock": 10000,
                };

                const Lko = {
                    "WorldLock": "<:WL:1151151006856532058>",
                    "DiamondLock": "<a:shinydl:1190166079700475954>",
                    "BlueGemLock": "<a:shinybgl:1190166261259321466>",
                }

                const wallet1 = await Bal.findOne({ GrowID: growIds })
                    .then((d) => {
                        console.log(d);
                        return d;
                    });

                try {
                    if (!wallet1) return message.reply("User Not Register In Database");
                    if (!itemvalue[item]) return message.reply("Unknown Item Name");

                    await Bal.findOneAndUpdate({ GrowID: growIds }, { $inc: { Balance: depo * itemvalue[item] } })
                        .then(async (d) => {
                            await message.reply(`Successfully Adding **${depo} ${Lko[item]}** to **${growId}**\nYour New Balance Is **${wallet1.Balance}** ${WL}`);
                        })
                        .catch(console.error);

                } catch (error) {
                    console.error("erorr", error);
                }
            }
        }
    }
})