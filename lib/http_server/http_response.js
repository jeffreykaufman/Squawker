'use strict';

function Response(socket) {
    this._headers = { };
    this._headersSent = false;
    this._isChunked = false;
    this._socket = socket;
}

Response.prototype.end = function() { }

Response.prototype.sendHeaders = function() {
    if(this._headersSent)
        throw new Error('Response headers already sent.');

    this._socket.write(`HTTP/1.1 200 OK\r\n`);

    Object.keys(this._headers).forEach(header => {
        this._socket.write(`${header}: ${this._headers[header]}\r\n`);
    });

    this._socket.write('\r\n');

    this._headersSent = true;
}

Response.prototype.setHeader = function(name, value) {
    this._headers[name] = value;
}

Response.prototype.write = function(chunk) {
    if(!this._headersSent) {
        if(!this._headers['Content-Length']) {
            this._isChunked = true;
            this.setHeader('Transfer-Encoding', 'chunked');
        }
        this.sendHeaders();
    }

    if(this._isChunked) {
        this._socket.write(`${chunk.length.toString(16)}\r\n`);
        this._socket.write(chunk);
        this._socket.write('\r\n');
    } else {
        this._socket.write(chunk);
    }
}

module.exports = Response;
