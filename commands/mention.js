module.exports = {
    name: 'mention',
    description: 'Mention!',
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.reply('There are no mention Try again!');
        }
        // create Map of mentioned user
        const mentioned = message.mentions.users.first();
        const name = mentioned.username;
        const user_id = mentioned.id;
        message.channel.send(`UserName : ${name}\nid: ${user_id}`);
    },
};