let {
	Client,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder
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
				.setDescription(`${text}`)
				.setTimestamp()

				.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
				.setFooter({
					text: `Use Botton For Action`,
					iconURL: client.user.displayAvatarURL({dynamic: true})
				});

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel('Buy')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<:duit:1170172864465473588>')
					.setCustomId('Howmanys'),
				new ButtonBuilder()
					.setLabel('Set GrowID')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<:Bot:1170169208273903677>')
					.setCustomId('growid23'),
				new ButtonBuilder()
					.setLabel('Balance')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:dollarfire:1174338459113103451>')
					.setCustomId('balance1'),
				new ButtonBuilder()
					.setLabel('Deposit')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:world:1174338186189733899>')
					.setCustomId('deposit')
			);

			Yayay.edit({embeds: [embed], components: [row]});
		}, 11000);
	}
};
