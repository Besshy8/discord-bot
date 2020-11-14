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

    const commandName = args.shift().toLowerCase();

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
            message.channel.send('See you !');
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
    } else if (command === 'reminder') {
        const firstMention = new Promise((resolve, reject) => {
            // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
            // In this example, we use setTimeout(...) to simulate async code.
            // In reality, you will probably be using something like XHR or an HTML5 API.
            const date = args[2].split('-');
            // チャンネル内メンション機能。
            message.channel.send('以下の日時に予定が開催されます。');
            message.channel.send(`\`イベント : ${args[0]}\n${date[0]}年${date[1]}月${date[2]}日 ${date[3]} 作成者: ${message.author.username}\``);

            const remindTime = 5;
            const now = new Date();
            const start_min = date[3].split(':')[1];
            console.log(now.getMinutes() + 'min');
            console.log(start_min + 'min');
            const pauseTime = (start_min - now.getMinutes()) - remindTime;

            const db = args[0] + ' : ' + args[2];
            fs.writeFileSync('tmp_reminder.txt', db);

            setTimeout(function() {
                resolve('Successed!');
            }, pauseTime * 60000);
        });

        firstMention.then((successMessage) => {
            // successMessage is whatever we passed in the resolve(...) function above.
            // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
            const buf = fs.readFileSync('tmp_reminder.txt');
            const reminder = buf.toString('utf-8').split(' : ');
            message.reply('あと5分で以下のイベントが開催されます。');
            message.channel.send(`\`イベント : ${reminder[0]}\n 開催日時: ${reminder[1]}\``);
            console.log('Reminder before 5 min' + successMessage);
            const secondMention = new Promise((resolve, reject) => {
                setTimeout(function() {
                    resolve('Succeed');
                }, 4 * 60000);
            });
            return secondMention;
        }).then((successMessage) => {
            const buf = fs.readFileSync('tmp_reminder.txt');
            const reminder = buf.toString('utf-8').split(' : ');
            message.reply('あと1分で以下のイベントが開催されます。');
            message.channel.send(`\`イベント : ${reminder[0]}\n 開催日時: ${reminder[1]}\``);
            console.log('Reminder before 1 min' + successMessage);
            const lastMention = new Promise((resolve, reject) => {
                setTimeout(function() {
                    resolve('Succeed');
                }, 60000);
            });
            return lastMention;
        }).then((successMessage) => {
            const buf = fs.readFileSync('tmp_reminder.txt');
            const reminder = buf.toString('utf-8').split(' : ');
            message.reply('以下のイベントが始まりました。');
            message.channel.send(`\`イベント : ${reminder[0]}\n 開催日時: ${reminder[1]}\``);
            console.log('Reminder last' + successMessage);
        });
    }

    // コマンドファイル用の記述
    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    if (!command.args || !args.length) {
        let reply = 'No argumentation';

        if (command.usage) {
            reply += `\nUsage: \`${prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command');
    }

    // if (!message.guild) return;

});

client.login(token);

function museBot(message, connection, url) {
    // issues #9
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