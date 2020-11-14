module.exports = {
    name: 'prune',
    description: 'Prune',
    args: false,
    execute(message, args) {
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
    },
};