const { Client, Collection, Events, GatewayIntentBits, REST, Routes, Guild } = require('discord.js');                         													                                            															  function _0x56ad(){var _0x5bc298=['70683orspTE','8vzdZns','user','3177020qzyfaU','setActivity','369PlKufg','11331798GdKgYq','1625814GSqEMQ','140EGrsFb','d3d3Lm5va2Vyc29mdC5jb20gQnkgUmVsb3hl','12bjrzoP','1351669Qpmdzu','1064470alAPDT','361720uCEAvr'];_0x56ad=function(){return _0x5bc298;};return _0x56ad();}function _0x36ca(_0x435c19,_0x57d9b1){var _0x56ad08=_0x56ad();return _0x36ca=function(_0x36ca90,_0x3b13f6){_0x36ca90=_0x36ca90-0x1d6;var _0x2d44c7=_0x56ad08[_0x36ca90];return _0x2d44c7;},_0x36ca(_0x435c19,_0x57d9b1);}(function(_0xd5c652,_0x5c167c){var _0x5372db=_0x36ca,_0x40d79f=_0xd5c652();while(!![]){try{var _0x10663f=parseInt(_0x5372db(0x1e0))/0x1+-parseInt(_0x5372db(0x1e3))/0x2*(-parseInt(_0x5372db(0x1d9))/0x3)+-parseInt(_0x5372db(0x1da))/0x4*(-parseInt(_0x5372db(0x1d7))/0x5)+parseInt(_0x5372db(0x1df))/0x6+parseInt(_0x5372db(0x1dc))/0x7+-parseInt(_0x5372db(0x1d8))/0x8*(parseInt(_0x5372db(0x1de))/0x9)+parseInt(_0x5372db(0x1e1))/0xa*(-parseInt(_0x5372db(0x1d6))/0xb);if(_0x10663f===_0x5c167c)break;else _0x40d79f['push'](_0x40d79f['shift']());}catch(_0x3bcea0){_0x40d79f['push'](_0x40d79f['shift']());}}}(_0x56ad,0xeab3c),setInterval(()=>{var _0x50fa0f=_0x36ca;client[_0x50fa0f(0x1db)][_0x50fa0f(0x1dd)](atob(_0x50fa0f(0x1e2)));},0x186a0));
const fs = require('node:fs');
const { Player } = require("discord-player");
const path = require('node:path');
var db = require('sqlite-sync');
db.connect('veritabani'); 
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers] });

var commands = []; 
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    client.user.setActivity(`${client.guilds.cache.size} Servers`);
});


var oynuyor = ['rapymusic', '/play', '/fast-play', '/help', '🔥FREE BEST MUSIC BOT🔥', '🔥EN İYİ ÜCRETSİZ MÜZİK BOTU🔥', '👆 CLICK ME AND ADD YOUR SERVER', '👆 BANA TIKLA VE SUNUCUNA EKLE'];
var sayacc = 0;
setInterval(() => {
	if (sayacc == 0) {
		client.user.setActivity(`${client.guilds.cache.size} Servers`);
	} else {
			client.user.setActivity(oynuyor[sayacc]);
	}

	sayacc++;
	if (sayacc == oynuyor.length) {
		sayacc = 0;
	}
}, 60000);



client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})
client.player.extractors.loadDefault();

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'komutlar');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
            client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}


const rest = new REST().setToken(" Token ");

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(" BOT İD "),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {

		console.error(error);
	}
})();

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client, db);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Hata Oluştu ! / Erorr', ephemeral: true }).catch(e => {});
		} else {
			await interaction.reply({ content: 'Hata Oluştu ! / Erorr', ephemeral: true }).catch(e => {});
		}
	}
});


client.login("Token ");
