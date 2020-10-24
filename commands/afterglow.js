module.exports = {
    name: 'afterglow',
    description: 'Afterglow',
    execute(message, args) {
        if (!args.length) {
            message.channel.send('No arumentation');
        } else if (args[0] === 'Hey!') {
            message.channel.send('YOLO!!!!');
        }
        message.channel.send(`Command Name : ${this.name}\nArguments : ${args}`);

    },
};