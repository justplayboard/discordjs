const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ytdl')
		.setDescription('유튜브 url 음악 듣기')
        .addSubcommand(subcommand => 
            subcommand
                .setName('재생')
                .setDescription('유튜브 url 음악 재생')
                .addStringOption(option => 
                    option.setName('url')
                        .setDescription('유튜브 url 입력')))
        .addSubcommand(subcommand => 
            subcommand
                .setName('정지')
                .setDescription('유튜브 url 음악 정지')),

	async execute(interaction) {
		if (interaction.options.getSubcommand() === '재생') {
			const url = interaction.options.getString('url');
            console.log(url);

            if(!interaction.member.voice.channel) {
                await interaction.reply("음성채널에 입장해주세요!");
                return;
            }
            if(getVoiceConnection(interaction.member.guild.id)) {
                const connection = getVoiceConnection(interaction.member.guild.id);
                connection.destroy();
            }
    
            const connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.member.guild.id,
                adapterCreator: interaction.member.voice.channel.guild.voiceAdapterCreator,
            });
        
            var stream = await ytdl(url, {
                highWaterMark: 1 << 25,
                filter: 'audioonly',
            });
            const resource = createAudioResource(stream, { inputType: StreamType.Opus });
            const player = createAudioPlayer();
            connection.subscribe(player);
            player.play(resource);
        
            await interaction.reply("재생되었습니다.");
        
            player.on(AudioPlayerStatus.Idle, () => connection.destroy());

		} else if (interaction.options.getSubcommand() === '정지') {
            const connection = getVoiceConnection(interaction.member.guild.id);

            if(!connection) {
                return await interaction.reply("재생되지 않고 있습니다.");
            }

            connection.destroy();
            await interaction.reply("정지되었습니다.");
		}
	},
};
