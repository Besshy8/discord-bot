module.exports = {
    name: 'avatar',
    description: 'Avatar',
    execute(message, args) {
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
    },
};