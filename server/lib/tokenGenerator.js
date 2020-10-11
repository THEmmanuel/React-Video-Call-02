module.exports = (length) => {
    let value = '';
    while (value.length < length) {
        value += Math.random().toString(16).substring(2);
    }
    return value.substring(0,length);
}