const fs = require('fs');
const Discord = require('discord.js');
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
    } else if (command == 'mention') {
        client.commands.get('mention').execute(message, args);
    } else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: <${message.author.displayAvatarURL()}>`);
        }
        // const mentioned = message.mentions.users.first();
        // message.channel.send(`${mentioned.username}'s avatar URL is ${mentioned.displayAvatarURL({ format: 'png', dynamic: false })}`);
        // console.log(mentioned);
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: <${user.displayAvatarURL({ format: 'png', dynamic: true })}>\nUsers discriminator is ${user.discriminator}`;
        });
        message.channel.send(avatarList);

    } else if (command === 'prune') {
        const amount = parseInt(args[0]);
        // BOTのパーミッション周りでエラーがはかれたので調査
        if (isNaN(amount)) {
            return message.reply('that doesn\'t seem to be a valid number.');
        } else if (amount < 2 || amount > 100) {
            return message.reply('Invalid Number (Needed 2 to 100)');
        }
        // TO DO not console log -> message.channel.send
        message.channel.bulkDelete(amount, true).catch(err => {
            console.error(err);
            message.channel.send('There was an error trying to prune message');
        });
    }
});

client.login(token);