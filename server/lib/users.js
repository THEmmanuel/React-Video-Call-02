const generateToken = require('./tokenGenerator');

const users = {}

async function uniqueToken(){
    let id = generateToken(12);
    while (id in users){
        await Promise.delay(5);
        id = generateToken(12);
    }
    return id;
}

exports.create = async (socket) => {
    const id = await uniqueToken();
    users[id] = socket
    return id;
};

exports.get = id => users[id];
exports.remove = id => delete users[id]

console.log(uniqueToken());