const generateToken = require('./tokenGenerator');

const users = {}

async function uniqueToken(){
    let token = generateToken(12);
    while (token in users){
        await Promise.delay(5);
        token = generateToken(12);
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