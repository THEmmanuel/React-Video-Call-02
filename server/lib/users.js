const generateToken = require('./tokenGenerator');

const users = {}

async function uniqueToken(){
    let token = generateToken(7);
    while (token in users){
        await Promise.delay(5);
        token = generateToken(6);
    }
    return token;
}

exports.create = async (socket) => {
    const token = await uniqueToken();
    users[token] = socket;
    return token;
};

exports.get = token => users[token];
exports.remove = token => delete users[token]

console.log(uniqueToken());