const { SlashCommandBuilder } = require('discord.js');

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

module.exports = {
	data: new SlashCommandBuilder()
		.setName('가위바위보')
		.setDescription('가위바위보 게임')
        .addStringOption(option => 
            option.setName('선택')
                .setDescription('카테고리')
                .setRequired(true)
                .addChoices(
                    { name: '가위', value: '가위' },
                    { name: '바위', value: '바위' },
                    { name: '보', value: '보' },
                )),
	async execute(interaction) {
        const choice = interaction.options.getString('선택');

		if(choice === '가위' || choice === '바위' || choice === '보') {
            const human = choice;
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
	},
};
