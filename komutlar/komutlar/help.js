const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Rapy Music'),
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
        const embedd = new EmbedBuilder()
            if (row[0].dil == "en") {
              embedd
                .setTitle("Rapy Music | Help")
                .setDescription("**/play** | Adds the url or song name you entered to the queue. \n**/stop** | Turns off the playback. \n**/pause** | Pauses playback. \n**/resume** | Resumes paused playback \n**/fastplay** | starts playing the url or song name you entered, search results are not shown. \n**/bassboost** | Bass adjustment is made for playback. \n \n[Website](https://rapymusic.nokersoft.com/) \n[Bot developer contact](https://bionluk.com/reloxe) \n[Add the bot to your server](https://discord.com/oauth2/authorize?client_id=930554317323264060&scope=bot&permissions=2150893568)")
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
            } else if (row[0].dil == "tr") {
                embedd
                .setTitle("Rapy Music | Yardım")
                .setDescription("**/play** | Girdiğiniz url veya şarkı adını çalma kuyruğa ekler. \n**/stop** | Oynatmayı kapatır. \n**/pause** | Oynatmayı duraklatır. \n**/resume** | Duraklatılmış oynatmayı sürdürür. \n**/fastplay** | Girdiğiniz url veya şarkı adını oynatmaya başlar arama sonuçları gösterilmez. \n**/bassboost** | Oynatmaya bass ayarı yapılır. \n \n[Website](https://rapymusic.nokersoft.com/) \n[Bot geliştirici iletişim](https://bionluk.com/reloxe) \n[Botu sunucuna ekle](https://discord.com/oauth2/authorize?client_id=930554317323264060&scope=bot&permissions=2150893568)")
                .setColor("#00b0f4")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
            }
            await interaction.editReply({ embeds: [embedd] }).catch(() => null);
        }
	},
};
