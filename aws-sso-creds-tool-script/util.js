const readline = require('readline');

exports.error = (...err) => { throw Error(...err) }

exports.waitForInput = (query) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}