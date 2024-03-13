const client = require('../../index.js');
let {
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder
} = require('discord.js');
const {ActivityType} = require('discord.js');
const {
	WL,
	CROWN,
	ARROW,
	DANGER,
	LiveChannel
} = require('../../config/config.json');
const shop = require('../../Schema/shop.js');
const Price = require('../../Schema/price.js');
const list = require('../../Schema/list.js');

module.exports = {
	name: 'ready'
};

client.once('ready', async (client) => {
	try {
		const channelId = client.channels.cache.get(LiveChannel);

		if (!channelId) return console.log(`<#${channelId}> not found`);

		const botMessages = await channelId.messages.fetch({limit: 10});
		const lastMessage = botMessages
			.filter((msg) => msg.author.id === client.user.id)
			.last();

		if (lastMessage) {
			console.log('Deleting last message and send new message');
			await lastMessage.delete();
		}

		const Yayay = await channelId.send({
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
                ${CROWN} **${code.name}** ${CROWN}
                ${ARROW} Code: **${code.code}**
                ${ARROW} Stock: **${stock.length > 0 ? stock.length : '0'}**
                ${ARROW} Price: **${
					price ? price.price : 'Not Set Yet'
				} ${WL}**\n=========================`.replace(/ {2,}/g, '');
			}
			const polas = new Date();

			const format = `<t:${Math.floor(polas.getTime() / 1000)}:R>`;

			const embed = new EmbedBuilder()
				.setTitle(`PRODUCT LIST\nLast Update: ${format}`)
				.setDescription(`=========================${text}`)
				.setFields({
					name: `${DANGER} HOW TO BUY ${DANGER}`,
					value:
						'- Click Button **Set GrowID** To Set Your GrowID' +
						'\n- Click Button **Balance** To Check Your Balance' +
						'\n- Click Button **Deposit** To See Deposit World' +
						'\n- Click Button **BUY** To Buying Product(s)'
				})
				.setTimestamp()

				.setThumbnail(client.user.displayAvatarURL({dynamic: true}))
				.setFooter({
					text: `Use Botton For Action`,
					iconURL: client.user.displayAvatarURL({dynamic: true})
				})
				.setColor('Random');

			const row = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel('Buy')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:CrownKing:1156829386914406410>')
					.setCustomId('Howmanys'),
				new ButtonBuilder()
					.setLabel('Set GrowID')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:AttentionAnimated:1208415777183629312>')
					.setCustomId('growid23'),
				new ButtonBuilder()
					.setLabel('Balance')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:pcsmoney:1136204103278665759>')
					.setCustomId('balance1'),
				new ButtonBuilder()
					.setLabel('Deposit')
					.setStyle(ButtonStyle.Secondary)
					.setEmoji('<a:world:1174338186189733899>')
					.setCustomId('deposit')
			);

			Yayay.edit({embeds: [embed], components: [row]});
		}, 10000);
	} catch (err) {
		console.log(err);
	}

	let activities = [`AzxStore`, `Created By r11z.`],
		i = 0;
	setInterval(async () => {
		client.user.setPresence({
			activities: [
				{
					name: `${activities[i++ % activities.length]}`,
					type: ActivityType.Watching
				}
			],
			status: 'dnd'
		});
	}, 15000);
	console.log('----------------------------------------'.white);
	console.log(`[READY] ${client.user.tag} is up and ready to go.`.bold);
	console.log('----------------------------------------'.white);
});
