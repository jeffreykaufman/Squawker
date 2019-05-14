'use strict';

class Path {
    constructor(str) {
        this.arguments = [];

        if(str.length > 1) {
            this.value = str.split('/').map(dir => {
                if(dir.charAt(0) == ':') {
                    this.arguments.push(dir.substring(1));
                    return '*';
                } else {
                    return dir;
                }
            }).join('/');
        } else {
            this.value = str;
        }
    }

    static validate(str) {
        return /^(\/(?:[\w-.:~]+\/?)*)$/g.test(str);
    }
}

module.exports = Path;
