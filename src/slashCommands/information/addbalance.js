let {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle
} = require('discord.js');
const {
	Client,
	CommandInteraction,
	AttachmentBuilder,
	ApplicationCommandOptionType,
	ChannelType
} = require('discord.js');
let Bal = require('../../Schema/balance.js');
const {Owner, Admin, WL, COLOR} = require('../../config/config.json');
module.exports = {
	name: 'addbalance',
	description: 'add balance to user',
	ownerOnly: true,
	options: [
		{
			name: 'user',
			description: 'User To Add Balance',
			type: ApplicationCommandOptionType.User,
			required: true
		},
		{
			name: 'balance',
			description: 'how many balance?',
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let growId1 = interaction.options.getUser('user');
		let growId = growId1.id;
		let user = interaction.user;

		let Balance = interaction.options.getNumber('balance');
		let wallet1 = await Bal.findOne({DiscordID: growId})
			.then((d) => {
				console.log(d);
				return d;
			})
			.catch((e) => console.error(e));

		if (!wallet1)
			return interaction.reply(
				'The user with the GrowID you provided or the tagged user was not found'
			);
		await Bal.updateOne({DiscordID: growId}, {$inc: {Balance: Balance}});

		let wallet = await Bal.findOne({DiscordID: growId})
			.then((d) => {
				return d.Balance;
			})
			.catch(console.error);
		let bgl = Math.floor(parseFloat(wallet) / 10000);
		let dl = Math.floor((parseFloat(wallet) % 10000) / 100);
		let wl = Math.round((parseFloat(wallet) % 10000) % 100);
		/*const addbal = new EmbedBuilder()
          .setTitle("Add Balance")
          .addField("Wallet", `${Balance} ${WL} Balance Added To ${growId}`)
          .setDescription(`Total Balance : \n${wallet}`)
          .addField("Blue Gem Lock", `${bgl}`)
          .addField("Diamond Lock", `${dl}`)
          .addField("World Lock", `${wl}`)
          .setTimestamp()
          .setColor(COLOR);*/
		interaction.reply({
			content: `${Balance} Balance Added To <@${growId}>`,
			ephemeral: true
		});
		//interaction.channel.send({ embeds: [addbal] });
		const sendToOwner = new EmbedBuilder()
			.setTitle('Adding And Removed Balance History')
			.setDescription(
				`
         User: <@${wallet1.DiscordID}>
         Amount: ${Balance}
       `.replace(/ {2,}/g, '')
			)
			.setTimestamp()
			.setColor(COLOR);
		user.send({embeds: [sendToOwner]});
	}
};
