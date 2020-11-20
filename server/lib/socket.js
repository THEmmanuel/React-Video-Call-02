const io = require('socket.io');
const users = require ('./users');

const initSocket = socket => {
    let token;
    socket
    .on('init', async () => {
        token = await users.create(socket);
        socket.emit('init', {token});
    })

    .on('request', data => {
        const reciever = users.get(data.to);
        if (reciever) {
            reciever.emit('request', {from: token});
        }
    })

    .on('call', data => {
        const reciever = users.get(data.to);
        if (reciever) {
            reciever.emit('call', {...data, from: token});
        } else {
            socket.emit('failed')
        }
    })
    .on('end', data => {
        const reciever = users.get(data.to);
        if (reciever) {
            reciever.emit('end');
        }
    })
    .on('disconnect', () => {
        users.remove(token)
        console.log(token, 'disconnected');
    });
}

module.exports = server => {
    io({
        path: '/bridge', serveClient: false})
        .listen(server, {log:true})
        .on('connection', initSocket);
}