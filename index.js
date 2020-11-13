const fs = require('fs');
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commmandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commmandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
    if (message.author.bot) return;
    // console.log(message.content);
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.content === `Afterglow${prefix}`) {
        message.channel.send('えいえいお〜〜');
    } else if (message.content.startsWith('afterglow')) {
        message.channel.send('も〜 一緒に言ってよぉ〜');
    } else if (message.content === 'server_info') {
        message.channel.send(`The server name is : ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    } else if (message.content === 'user_info') {
        message.channel.send(`Your username is : ${message.author.username}\nYour ID is :${message.author.id}`);
    } else if (command === 'play') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            museBot(connection, args[0]);
        } else {
            message.reply('You need to join a voice channel first!');
        }
    }
    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command');
    }

    // if (!message.guild) return;

});

client.login(token);

async function museBot(connection, url) {
    const dispatcher = connection.play(await ytdl(url));

    dispatcher.setVolume(1.0);

    dispatcher.on('finish', () => {
        console.log('Finished playing!');
        // dispatcher.destroy();
    });
}
