const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
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
    } else if (command === 'afterglow') {
        if (!args.length) {
            message.channel.send('No arumentation');
        } else if (args[0] === 'Hey!') {
            message.channel.send('YOLO!!!!');
        }
        message.channel.send(`Command Name : ${command}\nArguments : ${args}`);
    }
});

client.login(token);