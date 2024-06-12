const { Client, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ComponentType, ButtonStyle } = require('discord.js');
const { useQueue } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bassboost')
		.setDescription('Rapy Music')
    .addStringOption(option =>
      option.setName('config')
          .setDescription('Bass Boost filters status choices')
          .setRequired(true)
          .addChoices(
              { name: 'Disable', value: 'kapa' },
              { name: 'Normal Bassboost', value: 'normalbos' },
              { name: 'Bassboost And Treble', value: 'treblebos' },

          ),
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
        let queue;
        try {
            queue = useQueue(interaction.guild.id);

        } catch (error) {
            interaction.editReply("Herhangibi bir şarkı kuyrukta yok / There is no song in the queue").catch(() => null);
            return;
        }

        const embedd = new EmbedBuilder()
            if (row[0].dil == "en") {
                if (!queue.node.isPlaying()) return interaction.editReply("There is no song in the queue");
                if (interaction.options.getString('config') === "normalbos") {
                  queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.FullBass);
                } else if (interaction.options.getString('config') === "treblebos") {
                  queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.FullBassTreble);
                } else {
                  queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.Flat);
                }
              embedd
                .setTitle("Rapy Music | BassBoost")
                .setDescription(`
                **Setting Successful !**

                [Add the bot to your server](https://discord.com/oauth2/authorize?client_id=930554317323264060&scope=bot&permissions=2150893568)
                `)
                .setColor("#00b0f4")
                .setThumbnail("https://cdn.discordapp.com/attachments/1200637152409690113/1204154294635339837/speaker-15986.png")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
            } else if (row[0].dil == "tr") {
              if (!queue.node.isPlaying()) return interaction.editReply("Herhangibi bir şarkı kuyrukta yok");
              if (interaction.options.getString('config') === "normalbos") {
                queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.FullBass);
              } else if (interaction.options.getString('config') === "treblebos") {
                queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.FullBassTreble);
              } else {
                queue.filters.equalizer.setEQ(queue.filters.equalizerPresets.Flat);
              }
                
                embedd
                .setTitle("Rapy Music | BassBoost")
                .setDescription(`
                **Ayarlama Başarılı !**

                [Botu sunucuna ekle](https://discord.com/oauth2/authorize?client_id=930554317323264060&scope=bot&permissions=2150893568)
                `)
                .setColor("#00b0f4")
                .setThumbnail("https://cdn.discordapp.com/attachments/1200637152409690113/1204154294635339837/speaker-15986.png")
                .setFooter({
                  text: "Rapy Music",
                })
                .setTimestamp();
            }
            await interaction.editReply({ embeds: [embedd] }).catch(() => null);
        }
	},
};
