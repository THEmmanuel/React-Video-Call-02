const io = require('socket.io');
const users = require ('./users');

const initSocket = socket => {
    let id;
    socket
    .on('init', async () => {
        id = await users.create(socket);
        socket.emit('init', {id});
    })

    .on('request', data => {
        const reciever = users.get(data.to);
        if (reciever) {
            reciever.emit('request', {from: id});
        }
    })

    .on('call', data => {
        const reciever = users.get(data.to);
        if (reciever) {
            reciever.emit('call', {...data, from: id});
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
        users.remove(id)
        console.log(id, 'disconnected');
    });
}

module.exports = server => {
    io({
        path: '/bridge', serveClient: false})
        .listen(server, {log:true})
        .on('connection', initSocket);
}