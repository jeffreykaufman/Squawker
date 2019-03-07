'use strict';

function Path(str) {
    if(!(this instanceof Path))
        return new Path(...arguments);

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

Path.validate = function(str) {
    return /^(\/(?:[\w-.:~]+\/?)*)$/g.test(str);
}

module.exports = Path;
