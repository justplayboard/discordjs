const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder().setName('가위').setDescription('가위바위보'),
    new SlashCommandBuilder().setName('바위').setDescription('가위바위보'),
    new SlashCommandBuilder().setName('보').setDescription('가위바위보'),
	new SlashCommandBuilder().setName('재생').setDescription('음악'),
    new SlashCommandBuilder().setName('정지').setDescription('음악'),
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
