'use strict';

const fs = require('fs');

// Common Log Format (.log Files)
// 0.0.0.0 identifier user [1/Jan/2000:00:00:00 -0000] "GET / HTTP/1.1" 200 1024

function Logger(name) {
    if(!(this instanceof Logger))
        return new Logger(...arguments);

    let date = new Date();
    this.directories = ['log/', `${date.getFullYear()}/`, `${date.getMonth() + 1}/`.padStart(3, '0'), `${date.getDate()}/`.padStart(3, '0')];
    this.name = name;
    this.path = null;
    this.descriptor = null;
}

Logger.prototype.generate = function() {
    let path = process.cwd() + '/';

    console.log();

    for(let i = 0; i < this.directories.length; i++) {
        path = path + this.directories[i];

        if(!fs.existsSync(path))
            fs.mkdirSync(path);
    }

    this.descriptor = fs.openSync(path + this.name + '.log', 'a');
}

Logger.prototype.write = function() {
    if(arguments.length > 1) {
        let formattedStr = arguments[0];

        for(let i = 1; i < arguments.length; i++) {
            formattedStr = formattedStr.replace('%s', arguments[i]);
        }

        fs.write(this.descriptor, formattedStr, (error) => { });
    } else {
        fs.write(this.descriptor, arguments[0], (error) => { });
    }
}

module.exports = Logger;
