const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, getVoiceConnection, StreamType } = require('@discordjs/voice');
const ytdl = require('ytdl-core-discord');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

client.once('ready', c => {
	console.log(`${c.user.tag} 봇이 작동되었습니다.`);
});

client.login(token);

const convertEmoticon = (who) => {
    if(who === "가위") {
        return "✌";
    }
    else if(who === "바위") {
        return "✊";
    }
    else if(who === "보") {
        return "✋";
    }
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

    if(commandName === '가위' || commandName === '바위' || commandName === '보') {
        const human = commandName;
        const list = ["가위", "바위", "보"];
        const random = Math.floor(Math.random() * 3);

        const bot = list[random];

        let winner = "";

        if(human === bot) {
            winner = "비김";
        }
        else {
            human === "가위" ? (winner = bot === "바위" ? "봇" : "인간") : "";
            human === "바위" ? (winner = bot === "보" ? "봇" : "인간") : "";
            human === "보" ? (winner = bot === "가위" ? "봇" : "인간") : "";
        }

        const result = 
        `
        사람 : ${convertEmoticon(human)} vs 봇 : ${convertEmoticon(bot)}
        ${winner === "비김" ? "우리는 비겼다 휴먼." : winner + "의 승리다"}
        `;
        await interaction.reply(result);
    }

    if(commandName === '재생') {
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
    
        const url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk';
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
    }

    if(commandName === '정지') {
        const connection = getVoiceConnection(interaction.member.guild.id);
        if(!connection) {
            return await interaction.reply("재생되지 않고 있습니다.");
        }
        connection.destroy();
        await interaction.reply("정지되었습니다.");
    }
});
