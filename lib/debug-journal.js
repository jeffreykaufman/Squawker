'use strict';

const Musings   = require('musings');

let isGenerated = false;
let journal     = null;

module.exports = {
    generate: () => {
        journal = Musings.journal({
            conflict: 'replace',
            name: 'debug',
            timestamp: Musings.Timestamps.ISO8601
        });
        isGenerated = true;
    },
    write: (str) => {
        if(isGenerated)
            journal.write(str);
    }
};
