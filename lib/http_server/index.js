'use strict';

const HTTPRequest = require('./http_request');
const Methods = require('http').METHODS;
const net = require('net');
const Response = require('./http_response');
const Router = require('../router');

function HTTPServer() {
    this.router = new Router();
    this.server = net.createServer(socket => {
        let request;

        socket.once('readable', () => {
            let requestBuffer = new Buffer('');

            while(true) {
                let buffer = socket.read();

                if(buffer === null) {
                    break;
                }

                requestBuffer = Buffer.concat([requestBuffer, buffer]);

                if(requestBuffer.indexOf('\r\n\r\n') !== -1) {
                    break;
                }
            }

            request = new HTTPRequest(requestBuffer);

            let handler = this.router.getHandler(request);

            if(handler) {
                handler(request, new Response(socket));
            } else {
                // 404 not found
            }
        });
    });
}

HTTPServer.prototype.listen = function(port) {
    this.server.listen(port);
}

Methods.forEach(method => {
    HTTPServer.prototype[method.toLowerCase()] = function(path, handler) {
        this.router[method.toLowerCase()](path, handler);
    }
});

module.exports = HTTPServer;
