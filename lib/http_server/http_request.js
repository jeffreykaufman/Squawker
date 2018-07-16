'use strict';

function Request(buffer) {
    let lines = buffer.toString('utf-8').split(/\r\n/g);

    this.method = lines[0].split(/ /g)[0].toLowerCase();
    this.resource = lines[0].split(/ /g)[1].toLowerCase();

    console.log(this.method);
}

module.exports = Request;
