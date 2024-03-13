let {
	InteractionType,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder
} = require('discord.js');
const client = require('../../index');
let {WL} = require('../../config/config.json');
const mt = require('../../Schema/mt.js');
let Bal = require('../../Schema/balance.js');
let Bals = require('../../Schema/infogrowid.js');
let depo = require('../../Schema/depo.js');
let dl = require('../../Schema/dl.js');

module.exports = {
	name: 'ButtonMessage'
};

client.on('interactionCreate', async (interaction) => {
	if (interaction.customId === 'balance1') {
		let user = interaction.user.id;
		const row6000 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Set GrowID')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<:Bot:1170169208273903677>')
				.setCustomId('growid23')
		);
		if (!user)
			return interaction.reply({
				content: "Can't Find DiscordID Registered With That GrowID",
				components: [row6000],
				ephemeral: true
			});

		let wallet1 = await Bal.findOne({DiscordID: user})
			.then((d) => {
				return d;
			})
			.catch((e) => console.error(e));

		let wallets = await Bals.findOne({DiscordID: user})
			.then((d) => {
				return d;
			})
			.catch((e) => console.error(e));

		if (wallet1 && wallets) {
			const embed = new EmbedBuilder()
				.setTitle(`${interaction.user.username}'s Balance`)
				.setDescription(
					`- **GrowID: ${wallets.GrowID}**\n- **Balance: ${wallet1.Balance} ${WL}**`
				)
				.setTimestamp()

				.setThumbnail(client.user.displayAvatarURL({dynamic: true}));

			interaction
				.reply({embeds: [embed], ephemeral: true})
				.then(console.log('Ticket Sent to interaction Channel'))
				.catch(console.error);
		} else {
			await interaction.reply({
				content:
					'The user with the GrowID you provided or the tagged user was not found',
				components: [row6000],
				ephemeral: true
			});
		}
	}

	if (interaction.customId === 'deposit') {
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
			.setDescription(
				' World: **' +
					(deposit?.world ? deposit.world : 'Not Set Yet') +
					'**\n' +
					' Owner: **' +
					(deposit?.owner ? deposit.owner : 'Not Set Yet') +
					'**\n' +
					' Bot Name: **' +
					(deposit?.botName ? deposit.botName : 'Not Set Yet') +
					'**\n' +
					' Saweria Link: **' +
					(!rateDl && deposit?.saweria != 'No Set'
						? "Owner Hasn't Set DL Rate for Saweria"
						: deposit?.saweria == 'No Set'
						? "I Don't Accept Payment Using Saweria"
						: deposit?.saweria) +
					'**'
			)
			.setTimestamp()

			.setThumbnail(client.user.displayAvatarURL({dynamic: true}));

		interaction
			.reply({embeds: [embed], ephemeral: true})
			.then(console.log('Ticket Sent to interaction Channel'))
			.catch(console.error);
	}
});
