'use strict';

const Request = require('../lib/http_server/http_request');

require('chai').should();

describe('Request', function() {
    describe('#from()', function() {
        it('should validate arguments', function() {
            (function() {
                Request.from();
            }).should.throw(TypeError);

            (function() {
                Request.from(1);
            }).should.throw(TypeError);

            (function() {
                Request.from(1, 2)
            }).should.throw(TypeError);
        });

        it('should construct a Request', function() {
            Request.from('GET / HTTP/1.1\r\nAccept: */*\r\n\r\n').should.be.an.instanceOf(Request);
        });
    })
});
