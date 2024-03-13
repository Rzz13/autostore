let {EmbedBuilder} = require('discord.js');
const {
	Client,
	CommandInteraction,
	ApplicationCommandOptionType
} = require('discord.js');

const mt = require('../../Schema/mt');

const {COLOR} = require('../../config/config.json');
module.exports = {
	name: 'maintenance',
	description: 'add balance to user',
	ownerOnly: true,
	options: [
		{
			name: 'status',
			description: 'Set Maintenance mode status',
			type: ApplicationCommandOptionType.Boolean,
			required: true
		}
	],
	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 * @param {String[]} args
	 */
	run: async (client, interaction, args) => {
		let Mt = interaction.options.get('status');
		const user = interaction.user;

		const mtMode = Mt.value;
		console.log(mtMode);
		let maintenance = await mt.findOneAndUpdate(
			{Maintenance: {$exists: true}},
			{
				$set: {
					Maintenance: mtMode
				}
			},
			{upsert: true, new: true}
		);

		interaction.reply({
			content: `Maintenance Mode ${mtMode}`,
			ephemeral: true
		});
		const sendToOwner = new EmbedBuilder()
			.setTitle('Maintenance Mode')
			.setDescription(`Maintenance mode has changed to: ${mtMode}`)
			.setTimestamp()
			.setColor(COLOR);
		user.send({embeds: [sendToOwner]});
	}
};
