const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { useQueue, useMainPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
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
        const searchResult = await player.search(interaction.options.getString('url_or_song_name'), { requestedBy: interaction.user, searchEngine: 'youtubeSearch'}).catch(() => null);
        const buton0 = new ButtonBuilder()
        .setCustomId('buton0')
        .setLabel('No: 0')
        .setStyle(ButtonStyle.Secondary);
        const buton1 = new ButtonBuilder()
        .setCustomId('buton1')
        .setLabel('No: 1')
        .setStyle(ButtonStyle.Secondary);
        const buton2 = new ButtonBuilder()
        .setCustomId('buton2')
        .setLabel('No: 2')
        .setStyle(ButtonStyle.Secondary);
        const buton3 = new ButtonBuilder()
        .setCustomId('buton3')
        .setLabel('No: 3')
        .setStyle(ButtonStyle.Secondary);
        const buton4 = new ButtonBuilder()
        .setCustomId('buton4')
        .setLabel('No: 4')
        .setStyle(ButtonStyle.Secondary);
        const butonrow = new ActionRowBuilder();
        
        if (searchResult._data.tracks.length == 0 ) {} 
        else if (searchResult._data.tracks.length == 1) {butonrow.addComponents(buton0);} 
        else if (searchResult._data.tracks.length == 2) {butonrow.addComponents(buton0, buton1);} 
        else if (searchResult._data.tracks.length == 3) {butonrow.addComponents(buton0, buton1, buton2);} 
        else if (searchResult._data.tracks.length == 4) {butonrow.addComponents(buton0, buton1, buton2, buton3);} 
        else if (searchResult._data.tracks.length > 5) {butonrow.addComponents(buton0, buton1, buton2, buton3, buton4);}
      const embedd = new EmbedBuilder()
     
        if (row[0].dil == "en") { // ------------------------------------------------------------------------------------------------------------------------------
            if (!searchResult?.hasTracks()) return interaction.editReply("Requested song not found !");

            var basliklar = "";
            var secimlimiti = 0;
          for (let index = 0; index < searchResult._data.tracks.length; index++) {
          if (index == 5) {
            break;
          }
          secimlimiti++;
          basliklar += `NO: ${index} | ${searchResult._data.tracks[index].title}\n`;
          }

          embedd.setTitle("Rapy Music | Search Results").setDescription("Please make your selection from the buttons below\n\n ** " + basliklar + "**")
          .setColor("#00b0f4")
          .setFooter({text: "Rapy Music",}).setTimestamp();
            const seciciekran = await interaction.editReply({ embeds: [embedd], components: [butonrow] }).catch(() => null);
            const secicibutondinleyici = seciciekran.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });
            secicibutondinleyici.on('collect', async secilenbuton => {  
                await secilenbuton.deferReply({ ephemeral: false });
                if (secilenbuton.user.id != interaction.user.id) {
                    secilenbuton.channel.send("These buttons can only be used by the user using the command").catch(() => null);
                    return;
                }
                if (!interaction.member.voice.channel) return secilenbuton.editReply("Please join a voice channel!").catch(() => null);
                if (!interaction.member.voice.channel.viewable) return secilenbuton.editReply("I don't see the channel you joined!").catch(() => null);
                if (!interaction.member.voice.channel.joinable) return secilenbuton.editReply("I don't have permission to join the channel").catch(() => null);
                if (interaction.member.voice.channel.full) return secilenbuton.editReply("The channel is full there is no room to join").catch(() => null);
                const channel = interaction.member?.voice?.channel;

                if (secilenbuton.customId == "buton0") { await player.play(channel, searchResult._data.tracks[0], { nodeOptions: { metadata: interaction.channel }}).catch(() => null);
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
          
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton1") { await player.play(channel, searchResult._data.tracks[1], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[1].title)
                .setURL(searchResult._data.tracks[1].url)
                .setDescription("\n **Song added to queue! ** \n\n" + " ``Duration: " + searchResult._data.tracks[1].duration + " ``" + "\n ``Channel: " + searchResult._data.tracks[1].author + " ``")
                .setImage(searchResult._data.tracks[1].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
          
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton2") { await player.play(channel, searchResult._data.tracks[2], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[2].title)
                .setURL(searchResult._data.tracks[2].url)
                .setDescription("\n **Song added to queue! ** \n\n" + " ``Duration: " + searchResult._data.tracks[2].duration + " ``" + "\n ``Channel: " + searchResult._data.tracks[2].author + " ``")
                .setImage(searchResult._data.tracks[2].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();

                await seciciekran.delete().catch(() => null);
                await secilenbuton.channel.send({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton3") { await player.play(channel, searchResult._data.tracks[3], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[3].title)
                .setURL(searchResult._data.tracks[3].url)
                .setDescription("\n **Song added to queue! ** \n\n" + " ``Duration: " + searchResult._data.tracks[3].duration + " ``" + "\n ``Channel: " + searchResult._data.tracks[3].author + " ``")
                .setImage(searchResult._data.tracks[3].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();

                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton4") { await player.play(channel, searchResult._data.tracks[4], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[4].title)
                .setURL(searchResult._data.tracks[4].url)
                .setDescription("\n **Song added to queue! ** \n\n" + " ``Duration: " + searchResult._data.tracks[4].duration + " ``" + "\n ``Channel: " + searchResult._data.tracks[4].author + " ``")
                .setImage(searchResult._data.tracks[4].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
    
                
            });

        } else if (row[0].dil == "tr") { // ------------------------------------------------------------------------------------------------------------------------------
            if (!searchResult?.hasTracks()) return interaction.editReply("İstenen şarkı bulunamadı!").catch(() => null);

            var basliklar = "";
            var secimlimiti = 0;
          for (let index = 0; index < searchResult._data.tracks.length; index++) {
          if (index == 5) {
            break;
          }
          secimlimiti++;
          basliklar += `NO: ${index} | ${searchResult._data.tracks[index].title}\n`;
          }

          embedd.setTitle("Rapy Music | Arama Sonuçları").setDescription("Lütfen aşağıdaki butonlardan seçiminizi yapın\n\n ** " + basliklar + "**")
          .setColor("#00b0f4")
          .setFooter({text: "Rapy Music",}).setTimestamp();
            const seciciekran = await interaction.editReply({ embeds: [embedd], components: [butonrow] }).catch(() => null);
            const secicibutondinleyici = seciciekran.createMessageComponentCollector({
                componentType: ComponentType.Button,
            });
            secicibutondinleyici.on('collect', async secilenbuton => {  
                await secilenbuton.deferReply({ ephemeral: false });
                if (secilenbuton.user.id != interaction.user.id) {
                    secilenbuton.channel.send("Bu butonları sadece komutu kullanan kullanıcı kullanabilir").catch(() => null);
                    return;
                }
                if (!interaction.member.voice.channel) return secilenbuton.editReply("Lütfen bir ses kanalına katılın!").catch(() => null);
                if (!interaction.member.voice.channel.viewable) return secilenbuton.editReply("Katıldığın kanalı göremiyorum!").catch(() => null);
                if (!interaction.member.voice.channel.joinable) return secilenbuton.editReply("Kanala katılabilmek için iznim yok!").catch(() => null);
                if (interaction.member.voice.channel.full) return secilenbuton.editReply("Kanal dolu katılmak için yer yok!").catch(() => null);
                const channel = interaction.member?.voice?.channel;

                if (secilenbuton.customId == "buton0") { await player.play(channel, searchResult._data.tracks[0], { nodeOptions: { metadata: interaction.channel }}).catch(() => null);
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
          
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton1") { await player.play(channel, searchResult._data.tracks[1], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[1].title)
                .setURL(searchResult._data.tracks[1].url)
                .setDescription("\n **Şarkı kuyruğa eklendi! ** \n\n" + " ``Süre: " + searchResult._data.tracks[1].duration + " ``" + "\n ``Kanal: " + searchResult._data.tracks[1].author + " ``")
                .setImage(searchResult._data.tracks[1].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
          
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton2") { await player.play(channel, searchResult._data.tracks[2], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[2].title)
                .setURL(searchResult._data.tracks[2].url)
                .setDescription("\n **Şarkı kuyruğa eklendi! ** \n\n" + " ``Süre: " + searchResult._data.tracks[2].duration + " ``" + "\n ``Kanal: " + searchResult._data.tracks[2].author + " ``")
                .setImage(searchResult._data.tracks[2].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();

                await seciciekran.delete().catch(() => null);
                await secilenbuton.channel.send({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton3") { await player.play(channel, searchResult._data.tracks[3], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[3].title)
                .setURL(searchResult._data.tracks[3].url)
                .setDescription("\n **Şarkı kuyruğa eklendi! ** \n\n" + " ``Süre: " + searchResult._data.tracks[3].duration + " ``" + "\n ``Kanal: " + searchResult._data.tracks[3].author + " ``")
                .setImage(searchResult._data.tracks[3].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();

                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
                else if (secilenbuton.customId == "buton4") { await player.play(channel, searchResult._data.tracks[4], { nodeOptions: { metadata: interaction.channel }}).catch(() => null); 
                const embedd = new EmbedBuilder()
                .setTitle(searchResult._data.tracks[4].title)
                .setURL(searchResult._data.tracks[4].url)
                .setDescription("\n **Şarkı kuyruğa eklendi! ** \n\n" + " ``Süre: " + searchResult._data.tracks[4].duration + " ``" + "\n ``Kanal: " + searchResult._data.tracks[4].author + " ``")
                .setImage(searchResult._data.tracks[4].thumbnail)
                .setColor("#00b0f4")
                .setFooter({
                    text: "Rapy Music",
                })
                .setTimestamp();
                await seciciekran.delete().catch(() => null);
                await secilenbuton.editReply({ embeds: [embedd] }).catch(() => null);}
    
                
            });
          
        }

      }
	},
};