'use strict';

const Status = require('./statuses');

function Response(socket) {
    if(!(this instanceof Response))
        return new Response(...arguments);

    this.socket      = socket;
    this.headersSent = false;
    this.isChunked   = false;
    this.status      = new Status(200);
    this.headers     = { };
}

Response.build = function(socket) {
    let response = new Response(socket);
    return response;
}

Response.prototype.write = function(chunk) {
    if(!this.headersSent) {
        if(!this.headers['Content-Length']) {
            this.isChunked = true;
            this.setHeader('Transfer-Encoding', 'chunked');
        }
        this.sendHeaders();
    }

    if(this.isChunked) {
        this.socket.write(`${chunk.length.toString(16)}\r\n`);
        this.socket.write(chunk);
        this.socket.write('\r\n');
    } else {
        this.socket.write(chunk);
    }
}

Response.prototype.json = function(chunk) {
    if(!this.headersSent)
        this.setHeader('Content-Type', 'application/json');

    this.end(JSON.stringify(chunk));
}

Response.prototype.sendHeaders = function() {
    if(this.headersSent)
        throw new Error('Response headers already sent.');

    this.socket.write(`HTTP/1.1 ${this.status.code} ${this.status.description}\r\n`);
    this.headers['Date'] = new Date().toUTCString();

    Object.keys(this.headers).forEach(header => {
        this.socket.write(`${header}: ${this.headers[header]}\r\n`);
    });

    this.socket.write('\r\n');
    this.headersSent = true;
}

Response.prototype.setHeader = function(name, value) {
    this.headers[name] = value;
}

Response.prototype.end = function(chunk) {
    if(!this.headersSent) {
        if(!this.headers['Content-Length'])
            this.setHeader('Content-Length', chunk ? Buffer.from(chunk).length : 0);

        this.sendHeaders();
    }

    if(this.isChunked) {
        if(chunk) {
            this.socket.write(`${chunk.length.toString(16)}\r\n`);
            this.socket.write(chunk);
            this.socket.write('\r\n');
        }

        this.socket.end('0\r\n\r\n');
    } else {
        this.socket.end(chunk);
    }
}

module.exports = Response;
