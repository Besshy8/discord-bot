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
    // const urlMap = new Discord.Collection();
    // urlMap.set('Url', args[0]);

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
            // const dispatcher = connection.play(ytdl(url));
            museBot(message, connection, args[0]);
            const url = args[0];
            fs.writeFileSync('tmp.txt', url);
            // console.log(2); // museBotが実行前に実行される。
        } else {
            message.reply('You need to join a voice channel first!');
        }
    } else if (command === 'bye') {
        if (message.member.voice.channel) {
            message.member.voice.channel.leave();
            console.log('Bot left Voice chat !');
        } else {
            message.reply('You are not in voice channel');
        }
    } else if (command === 'stop') {
        if (message.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            // const dispatcher = connection.play(ytdl(url));
            const urlMapVal = fs.readFileSync('tmp.txt');
            const urlMap = new Discord.Collection();
            urlMap.set('Url', urlMapVal);
            pauseMusic(connection, `${urlMap.get('Url')}`);
            // console.log(2); // museBotが実行前に実行される。
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

function museBot(message, connection, url) {
    const dispatcher = connection.play(ytdl(url));

    dispatcher.pause([true]);
    sleep(1000);
    dispatcher.resume();
    console.log(`Waiting... ${dispatcher.pausedTime - 1} ms`);

    dispatcher.setVolume(0.1);

    // 'start'のイベントのdocが見つからない。
    dispatcher.on('start', () => {
        console.log('start playing!');
    });

    dispatcher.on('finish', () => {
        console.log('Finished playing!');
        message.member.voice.channel.leave();
    });
}

function pauseMusic(connection, url) {
    const dispatcher = connection.play(ytdl(url));
    dispatcher.pause();
    // pauseが5min続いたらleaveする。
}

// setIntervalでうまくいかない。以下のサイト参照。
// https://qiita.com/albno273/items/c2d48fdcbf3a9a3434db
function sleep(time) {
    const d1 = new Date();
    while (true) {
        const d2 = new Date();
        if (d2 - d1 > time) {
            return;
        }
    }
}