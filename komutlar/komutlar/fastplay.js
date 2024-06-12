const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fast-play')
		.setDescription('Rapy Music')
		.addStringOption(option => 
			option.setName("url_or_song_name")
			.setDescription("URL Or Song Name")
			.setRequired(true)
			),
	async execute(interaction, client, db) {
		await interaction.deferReply({ ephemeral: false });
        const row = db.run("SELECT * FROM dil_secenegi WHERE server_id = '" + interaction.guild.id + "'"); // dil kontrol sistemi baslangıç
        if (row.length == 0) { 
            const turkcebuton = new ButtonBuilder()
            .setCustomId('trbuton')
            .setEmoji("🇹🇷")
            .setLabel('Türkçe')
            .setStyle(ButtonStyle.Primary);
            const ingilizcebuton = new ButtonBuilder()
            .setCustomId('enbuton')
            .setEmoji("🇺🇸")
            .setLabel('English')
            .setStyle(ButtonStyle.Primary);
           const embedd = new EmbedBuilder()
            .setTitle("Select your language / Lütfen dilinizi seçin")
            .setDescription("**🇹🇷 Lütfen aşağıdaki butonlardan kullanmak istediğiniz dili seçiniz** \n\n **🇺🇸 Please select the language you want to use from the buttons below.** \n .")
            .setColor("#00b0f4")
            .setFooter({
              text: "Rapy Music",
            })
            .setTimestamp();
            const butonrow = new ActionRowBuilder().addComponents(turkcebuton, ingilizcebuton)
            const seciciekran = await interaction.editReply({ embeds: [embedd], components: [butonrow] }).catch(() => null);
                  const secicibutondinleyici = seciciekran.createMessageComponentCollector({
                      componentType: ComponentType.Button,
                  });
                  secicibutondinleyici.on('collect', async secilenbuton => {  
                    await seciciekran.delete().catch(() => null);
                    if (secilenbuton.customId == "trbuton") {
                        db.run(`INSERT INTO dil_secenegi (server_id, dil) VALUES ('${secilenbuton.guild.id}', 'tr')`);
                        await secilenbuton.reply("Tamamdır. \n Türkçe dili ayarlandı.").catch(() => null);
                    } else if (secilenbuton.customId == "enbuton") {
                        db.run(`INSERT INTO dil_secenegi (server_id, dil) VALUES ('${secilenbuton.guild.id}', 'en')`);
                        await secilenbuton.reply("Okey. \n English language is set.").catch(() => null);
                    }
                  });
                         return; }  // dil kontrol sistemi bitis
       
      else {
        const player = useMainPlayer();
        const queue = useQueue(interaction.guild.id);
     
      const embedd = new EmbedBuilder()
     
        if (row[0].dil == "en") { // ------------------------------------------------------------------------------------------------------------------------------
    
          if (!interaction.member.voice.channel) return interaction.editReply("Please join a voice channel!").catch(() => null);
          if (!interaction.member.voice.channel.viewable) return interaction.editReply("I don't see the channel you joined!").catch(() => null);
          if (!interaction.member.voice.channel.joinable) return interaction.editReply("I don't have permission to join the channel").catch(() => null);
          if (interaction.member.voice.channel.full) return interaction.editReply("The channel is full there is no room to join").catch(() => null);
            const searchResult = await player.search(interaction.options.getString('url_or_song_name'), { requestedBy: interaction.user, searchEngine: 'youtubeSearch'}).catch(() => null);
            const channel = interaction.member?.voice?.channel;
            if (!searchResult?.hasTracks()) return interaction.editReply("Requested song not found !").catch(() => null);
            await player.play(channel, searchResult._data.tracks[0], { nodeOptions: { metadata: interaction.channel }}).catch(() => null);
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[0].title)
                .setURL(searchResult._data.tracks[0].url)
                .setDescription("\n **Song added to queue! ** \n\n" + " ``Duration: " + searchResult._data.tracks[0].duration + " ``" + "\n ``Channel: " + searchResult._data.tracks[0].author + " ``")
                .setImage(searchResult._data.tracks[0].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
          
                await interaction.editReply({ embeds: [embedd] }).catch(() => null);

        } else if (row[0].dil == "tr") { // ------------------------------------------------------------------------------------------------------------------------------
       
          if (!interaction.member.voice.channel) return interaction.editReply("Lütfen bir ses kanalına katılın!").catch(() => null);
          if (!interaction.member.voice.channel.viewable) return interaction.editReply("Katıldığın kanalı göremiyorum!").catch(() => null);
          if (!interaction.member.voice.channel.joinable) return interaction.editReply("Kanala katılabilmek için iznim yok!").catch(() => null);
          if (interaction.member.voice.channel.full) return interaction.editReply("Kanal dolu katılmak için yer yok!").catch(() => null);
            const searchResult = await player.search(interaction.options.getString('url_or_song_name'), { requestedBy: interaction.user, searchEngine: 'youtubeSearch'}).catch(() => null);
            const channel = interaction.member?.voice?.channel;
            if (!searchResult?.hasTracks()) return interaction.editReply("İstenen şarkı bulunamadı!").catch(() => null);
        await player.play(channel, searchResult._data.tracks[0], { nodeOptions: { metadata: interaction.channel }}).catch(() => null);
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[0].title)
                .setURL(searchResult._data.tracks[0].url)
                .setDescription("\n **Şarkı kuyruğa eklendi! ** \n\n" + " ``Süre: " + searchResult._data.tracks[0].duration + " ``" + "\n ``Kanal: " + searchResult._data.tracks[0].author + " ``")
                .setImage(searchResult._data.tracks[0].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
     
                await interaction.editReply({ embeds: [embedd] }).catch(() => null);
          }

      }
	},
};