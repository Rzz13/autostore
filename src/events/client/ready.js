const client = require('../../index.js');
const {ActivityType} = require('discord.js');

module.exports = {
	name: 'ready'
};

client.once('ready', async (client) => {
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
