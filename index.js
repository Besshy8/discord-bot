const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    if (message.content === 'Afterglow!') {
        message.channel.send('えいえいお〜〜');
    }
});

client.login('NzYzMzk1NDc4Nzk1NzE0NTgw.X33FcQ.kXAzjjCtxgS-XsAg-hqOyCk49j0');