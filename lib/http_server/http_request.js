'use strict';

function HTTPRequest(buffer) {
    let lines = buffer.toString().split(/\r\n/g);

    this.method = lines[0].split(/ /g)[0].toLowerCase();
    this.resource = lines[0].split(/ /g)[1].toLowerCase();
}

module.exports = HTTPRequest;
