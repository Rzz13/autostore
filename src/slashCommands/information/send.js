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
	Message
} = require('discord.js');
let shop = require('../../Schema/shop.js');
let Price = require('../../Schema/price.js');
let list = require('../../Schema/list.js');
module.exports = {
	name: 'send',
	description: 'sending realtime product',
	ownerOnly: true,
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		await interaction.reply({
			content: `Sending Realtime`,
			ephemeral: true
		});

		const Yayay = await interaction.channel.send({
			content: `**Realtime Product Stock**`
		});

		setInterval(async () => {
			const getCodes = await list
				.find({})
				.then((res) => {
					return res;
				})
				.catch(console.error);
			if (getCodes.length < 1) return;
			let text = '';
			for (let i = 0; i < getCodes.length; i++) {
				const code = getCodes[i];
				const stock = await shop
					.find({code: code.code})
					.then((res) => {
						return res;
					})
					.catch(console.error);
				const price = await Price.findOne({code: code.code})
					.then((res) => {
						return res;
					})
					.catch(console.error);
				text += `
                  **${code.name}**
                  - Code: **${code.code}**
                  - Stock: **${stock.length > 0 ? stock.length : '0'}**
                  - Price: **${
										price ? price.price : 'Not Set Yet'
									} World Locks**
                  `.replace(/ {2,}/g, '');
			}
			const polas = new Date();
			const format = `<t:${Math.floor(polas.getTime() / 1000)}:R>`;
			const embed = new EmbedBuilder()
				.setTitle(`PRODUCT LIST\nLast Update: ${format}`)
				/*.setAuthor({
                  name: `TICKET`,
                  iconURL: client.user.avatarDisplayURL({ dynamic: true }),
                })*/
				.setDescription(`${text}`)
				.setTimestamp()

				.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
				.setFooter({
					text: `Use Botton For Action`,
					iconURL: client.user.displayAvatarURL({dynamic: true})
				});

			const row1 = new ActionRowBuilder().addComponents(
				new ButtonBuilder().setStyle(2).setCustomId('support').setEmoji('🎫')
			);
			const row = new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('support')
					.setPlaceholder('Make a selection 📜')
					.addOptions([
						{
							label: 'Buy',
							description: 'Buy Items Of Products',
							emoji: '<:duit:1170172864465473588>',
							value: 'Howmanys'
						},
						{
							label: 'GrowID',
							description: 'Add Your GrowID Into Database',
							emoji: '<:Bot:1170169208273903677>',
							value: 'setGrowID'
						},
						{
							label: 'Deposit',
							description: 'Check Deposit World',
							emoji: '<a:world:1174338186189733899>',
							value: 'deposit'
						},
						{
							label: 'Balance',
							description: 'Balance Info',
							emoji: '<a:dollarfire:1174338459113103451>',
							value: 'balance1'
						},
						{
							label: 'Stock',
							description: 'Stock Info',
							emoji: '<:history:1156560248023285881>',
							value: 'stock'
						}
					])
			);
			Yayay.edit({embeds: [embed], components: [row]});
		}, 11000);
	}
};
