let {WL, imageUrl, Owner, COLOR, ARROW} = require('../../config/config.json');
let {
	InteractionType,
	ModalBuilder,
	TextInputBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	TextInputStyle,
	ButtonBuilder
} = require('discord.js');
let Bal = require('../../Schema/balance.js');
let shop = require('../../Schema/shop.js');
let Bals = require('../../Schema/infogrowid.js');
let list = require('../../Schema/list.js');
let Price = require('../../Schema/price.js');
let order = require('../../Schema/order.js');
let ctesti = require('../../Schema/ctesti.js');
let client = require('../../index.js');
const mt = require('../../Schema/mt.js');

module.exports = {
	name: 'Buying Item Of Menu'
};

client.on('interactionCreate', async (interaction) => {
	const manuk = new ModalBuilder()
		.setCustomId('sammuh')
		.setTitle('Buying Product');
	const lamusa = new TextInputBuilder()
		.setCustomId('kontol')
		.setLabel('Code Of Products:')
		.setStyle(TextInputStyle.Short)
		.setMaxLength(10)
		.setMinLength(1)
		.setPlaceholder('Input Code Of Products Like You!')
		.setRequired(true);
	const rowdas = new ActionRowBuilder().addComponents(lamusa);
	manuk.addComponents(rowdas);

	const lamus = new TextInputBuilder()
		.setCustomId('summah')
		.setLabel('How Many')
		.setStyle(TextInputStyle.Short)
		.setMaxLength(3)
		.setMinLength(1)
		.setPlaceholder('How Many You Want To Buy?')
		.setValue('1')
		.setRequired(true);
	const rowda = new ActionRowBuilder().addComponents(lamus);
	manuk.addComponents(rowda);

	//Respons Growid
	const grow = new ModalBuilder()
		.setCustomId('growid1')
		.setTitle('Set Your GrowID');
	const a57 = new TextInputBuilder()
		.setCustomId('kontol')
		.setLabel('Input Your GrowID:')
		.setStyle(TextInputStyle.Short)
		.setMaxLength(20)
		.setMinLength(3)
		.setPlaceholder("Input Your GrowID In Here And Make Sure It's Correct")
		.setRequired(true);
	const row23 = new ActionRowBuilder().addComponents(a57);
	grow.addComponents(row23);

	try {
		const MT = await mt
			.findOne({Maintenance: true})
			.then((d) => {
				return d?.Maintenance;
			})
			.catch(console.error);

		if (interaction.customId === 'Howmanys') {
			if (MT) {
				interaction.reply({
					content: `Bot In Maintenance Mode`,
					ephemeral: true
				});
			} else {
				await interaction.showModal(manuk);
			}
		}

		if (interaction.customId === 'growid23') {
			await interaction.showModal(grow);
		}

		if (interaction.customId === 'growid21') {
			await interaction.showModal(grow);
		}
	} catch (error) {
		console.error(error);
		interaction.reply({
			content: `Ada Error!`,
			ephemeral: true
		});
	}

	if (interaction.customId === 'sammuh') {
		if (interaction.type !== InteractionType.ModalSubmit) return;
		const Reason = interaction.fields.getTextInputValue('summah');
		let item = interaction.fields.getTextInputValue('kontol');

		let getCode = await list
			.findOne({code: item})
			.then((res) => {
				return res;
			})
			.catch(console.error);
		if (!getCode)
			return interaction.reply({content: 'Code Not Found', ephemeral: true});
		let howmuch = Reason;
		if (howmuch < 1)
			return interaction.reply({
				content: 'Min order is 1',
				ephemeral: true
			});
		if (isNaN(howmuch))
			return interaction.reply({
				content: 'Only Use Number For Amount',
				ephemeral: true
			});
		let user = interaction.user;
		let userars = await client.users.fetch(Owner);
		let member = interaction.guild.members.cache.get(user.id);
		let row6050 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Set GrowID')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<:Bot:1170169208273903677>')
				.setCustomId('growid23')
		);
		let getBal = await Bal.findOne({DiscordID: user.id})
			.then((d) => {
				//console.log(d);
				return d;
			})
			.catch((e) => console.error(e));
		if (!getBal)
			return interaction.reply({
				content: 'Register First Before Using This Command!',
				components: [row6050],
				ephemeral: true
			});
		let wallet = getBal.Balance;
		let price = await Price.findOne({code: item})
			.then((d) => {
				//console.log(d);
				return d?.price;
			})
			.catch((e) => console.error(e));
		if (!price)
			return interaction.reply({
				content: 'Tag Owner To Set Price For ' + item,
				ephemeral: true
			});

		let data = await shop
			.find({code: item})
			.then((res) => {
				return res;
			})
			.catch(console.error);

		//console.log(price);

		let row645 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Balance')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<a:dollarfire:1174338459113103451>')
				.setCustomId('balance1'),
			new ButtonBuilder()
				.setLabel('Stock')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<:history:1156560248023285881>')
				.setCustomId('stock87'),
			new ButtonBuilder()
				.setLabel('Deposit')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<a:world:1174338186189733899>')
				.setCustomId('deposit')
		);

		if (data.length == 0)
			return interaction.reply({
				content: 'No Stock Yet',
				ephemeral: true
			});
		//console.log("Amount :", howmuch);
		//console.log("Stock :", data.length);
		if (Number(data.length) < Number(howmuch))
			return interaction.reply({
				content: 'Not That Much Stock',
				ephemeral: true
			});
		price = Number(price) * Number(howmuch);
		//console.log(price);
		if (wallet < price)
			return interaction.reply({
				content: 'Not enough money, The Price Is ' + price,
				ephemeral: true
			});
		let sending = '';
		const jumpa = await interaction.reply({
			content: 'Processing',

			ephemeral: true
		});
		if (!item.includes('script')) {
			for (let i = 0; i < howmuch; i++) {
				let send = await shop
					.findOneAndDelete({code: item})
					.then((res) => {
						return res;
					})
					.catch(console.error);
				sending += send.data + '\n';
			}
		} else {
			let send = await shop
				.findOne({code: item})
				.then((res) => {
					return res;
				})
				.catch(console.error);
			sending += send.data;
		}
		try {
			let doneBuy = new EmbedBuilder()
				.setTitle('Purchase was Successfull')
				.setDescription(
					"Purchase was successfull\nYou've successfully purchased " +
						item +
						' for ' +
						price +
						WL +
						"\ndon't forget to give reps, thanks"
				);

			user.send({
				content: 'This Is your Order\n# NO REPS NO WARRANTY',
				files: [
					{
						attachment: Buffer.from(sending),
						name: 'AzxStore.txt'
					}
				],
				embeds: [doneBuy]
			});
			userars.send({
				content: 'This Is ' + interaction.user.username + ' Order',
				files: [
					{
						attachment: Buffer.from(sending),
						name: `${interaction.user.username} order.txt`
					}
				]
			});
			jumpa.edit({
				content: 'Check your DM',

				ephemeral: true
			});
		} catch (erorr) {
			console.error('Gagal Mengirim Pesan: ', erorr);
			jumpa.edit({
				content:
					'Did you turn off DM? if Yes u can dm Owner, if he is good maybe will be given your order :):',
				ephemeral: true
			});
			user.send({
				content: `${interaction.user.username} Error Order`,
				files: [
					{
						attachment: Buffer.from(sending),
						name: 'FailOrder.txt'
					}
				]
			});
		}
		await Bal.updateOne({DiscordID: user.id}, {$inc: {Balance: -Number(price)}})
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

		let Ytta = await list.findOne({code: item}).then((res) => {
			return res?.role;
		});
		//console.log(Ytta);

		if (!member.roles.cache.some((r) => r.id == Ytta)) {
			member.roles.add(Ytta);
		}

		let orderN = await order
			.findOneAndUpdate({}, {$inc: {Order: 1}}, {upsert: true, new: true})
			.then((d) => {
				return d?.Order;
			})
			.catch(console.error);
		if (!orderN) orderN = 1;
		let itemName = await list
			.findOne({code: item})
			.then((res) => {
				return res?.name;
			})
			.catch(console.error);
		let testi = new EmbedBuilder()
			.setTitle('#Order Number: ' + orderN)
			.setDescription(
				ARROW +
					'Pembeli: **<@' +
					user.id +
					'>**\n' +
					ARROW +
					'Produk: **' +
					(itemName || 'IDK Name') +
					` ${howmuch}**\n` +
					ARROW +
					'Total Harga: **' +
					price +
					' ' +
					WL +
					' **\n**Thanks For Purchasing Our Product**'
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
				content: 'No testimoni channel setted!!!!',
				ephemeral: true
			});

		await ch.send({embeds: [testi]});
		let sendToOwner = new EmbedBuilder()
			.setTitle('Purchase History')
			.setDescription(
				`
           Buyer: ${
							interaction.user.id?.toString()
								? interaction.user.id.toString()
								: interaction.user.id
						}
           Item: ${item}
           Amount: ${howmuch}
         `.replace(/ {2,}/g, '')
			)
			.setColor(COLOR)
			.setTimestamp();
		userars.send({embeds: [sendToOwner]});
	}
	if (interaction.customId === 'growid1') {
		if (interaction.type !== InteractionType.ModalSubmit) return;
		let id = interaction.fields.getTextInputValue('kontol');
		// let correct = interaction.fields.getTextInputValue('confirm');

		let GrowID = id.toLowerCase();
		let user = interaction.user.id;
		let row600 = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setLabel('Set GrowID')
				.setStyle(ButtonStyle.Secondary)
				.setEmoji('<:Bot:1170169208273903677>')
				.setCustomId('growid23')
		);

		let checkuser = await Bals.findOne({DiscordID: user})
			.then((d) => {
				return d;
			})
			.catch(console.error);

		if (id.includes(id)) {
			let existingEntry = await Bal.findOne({GrowID: GrowID})
				.then((d) => {
					return d.DiscordID;
				})
				.catch((e) => console.error(e));

			if (existingEntry && existingEntry !== user) {
				interaction.reply({
					content: 'Sorry, GrowID Has Been Used',
					components: [row600],
					ephemeral: true
				});
			} else {
				await Bal.findOneAndUpdate(
					{DiscordID: user},
					{$set: {GrowID: GrowID}},
					{upsert: true, new: true, setDefaultsOnInsert: true}
				).then((res) => {
					console.log(res);
					if (checkuser) {
						interaction.reply({
							content: `Successfully Updated Your GrowID **${checkuser.GrowID}** to **${id}**`,

							ephemeral: true
						});
					} else {
						interaction.reply({
							content: `Welcome To Server\nSuccessfully Set You GrowID to **${id}**`,

							ephemeral: true
						});
					}
				});
				await Bals.findOneAndUpdate(
					{DiscordID: user},
					{$set: {GrowID: id}},
					{upsert: true, new: true, setDefaultsOnInsert: true}
				);
			}
		} else {
			interaction.reply({
				content: `Can Your Correctly?`,
				components: [row600],
				ephemeral: true
			});
		}
	}
});
