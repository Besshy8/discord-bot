module.exports = {
    name: 'avatar',
    description: 'Display Avatar Image of Mentioned',
    args: true,
    usage: '@username',
    execute(message, args) {
        if (args[0] === '--help') {
            let reply = `Description: ${this.description}`;
            reply += `\nUsage: \`!${this.name} ${this.usage}\``;
            return message.channel.send(reply);
        } else if (!message.mentions.users.size) {
            let reply = 'Invaild argumention. @Mention anyone!';
            reply += `\nRun  \`!${this.name} --help\`  for more information on a command. `;
            return message.channel.send(reply);
        }
        // const mentioned = message.mentions.users.first();
        // message.channel.send(`${mentioned.username}'s avatar URL is ${mentioned.displayAvatarURL({ format: 'png', dynamic: false })}`);
        // console.log(mentioned);
        const avatarList = message.mentions.users.map(user => {
            return `${user.username}'s avatar: ${user.displayAvatarURL({ format: 'png', dynamic: true })}`;
        });
        message.channel.send(avatarList);
    },
};