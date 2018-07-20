'use strict';

const Request = require('./http_request');
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

            request = Request.from(requestBuffer);

            let handler  = this.router.getHandler(request),
                response = new Response(socket);

            if(handler) {
                if(handler[request.method.toLowerCase()]) {
                    handler[request.method.toLowerCase()](request, response);
                } else {
                    response.setStatus(405, 'Method Not Allowed');
                    response.setHeader('Allow', Object.keys(handler).join(', ').toUpperCase());
                    response.end();
                }
            } else {
                response.setStatus(404, 'Not Found');
                response.end();
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
