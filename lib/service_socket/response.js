'use strict';

function Response(socket) {
    this._headers = { };
    this._headersSent = false;
    this._isChunked = false;
    this._socket = socket;
    this.status = {
        code: 200,
        description: 'OK'
    };
}

Response.prototype.end = function(chunk) {
    if(!this._headersSent) {
        if(!this._headers['Content-Length']) {
            this.setHeader('Content-Length', chunk ? Buffer.from(chunk).length : 0);
        }

        this.sendHeaders();
    }

    if(this._isChunked) {
        if(chunk) {
            this._socket.write(`${chunk.length.toString(16)}\r\n`);
            this._socket.write(chunk);
            this._socket.write('\r\n');
        }
        this._socket.end('0\r\n\r\n');
    } else {
        this._socket.end(chunk);
    }
}

Response.prototype.json = function(chunk) {
    if(!this._headersSent)
        this.setHeader('Content-Type', 'application/json');

    this.end(JSON.stringify(chunk));
}

Response.prototype.sendHeaders = function() {
    if(this._headersSent)
        throw new Error('Response headers already sent.');

    this._socket.write(`HTTP/1.1 ${this.status.code} ${this.status.description}\r\n`);
    this._headers['Date'] = new Date().toUTCString();

    Object.keys(this._headers).forEach(header => {
        this._socket.write(`${header}: ${this._headers[header]}\r\n`);
    });

    this._socket.write('\r\n');
    this._headersSent = true;
}

Response.prototype.setHeader = function(name, value) {
    this._headers[name] = value;
}

Response.prototype.setStatus = function(code, description) {
    this.status.code = code;
    this.status.description = description;
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
