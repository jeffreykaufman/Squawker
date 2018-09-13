'use strict';

const RegistryEntry = require('./registry-entry');

function Registry(rootKey) {
    if(!(this instanceof Registry))
        return new Registry(...arguments);

    this.root = new RegistryEntry(null, rootKey, null);
}

Registry.difference = function(key1, key2) {
    for(let i = 0; i < key1.length && i < key2.length; i++)
        if(key1.charAt(i) !== key2.charAt(i)) {
            return i;
        }

    return -1;
}

Registry.prototype.add = function(path, value) {
    if(!new RegExp('^' + this.root.key, 'g').test(path))
        throw new Error();

    let entry  = this.root;

    if(path === this.root.path)
        this.root.value = value;

    path = path.slice(entry.path.length);

    while(true) {
        let children     = entry.children.values(),
            lengthOfLCP  = 0,
            childWithLCP = null;

        for(let child of children) {
            let lengthOfCP = Registry.difference(path, child.key);

            if(lengthOfCP === -1) {
                lengthOfLCP = Math.min(path.length, child.key.length);
                childWithLCP = child;
                break;
            } else if (lengthOfCP > lengthOfLCP) {
                lengthOfLCP = lengthOfCP;
                childWithLCP = child;
            }
        }

        if(childWithLCP && lengthOfLCP > 1) { // If true, a common prefix was found.
            if(lengthOfLCP === 0) { // Matching path values - they correspond to the same entry.
                if(childWithLCP.value)
                    throw new Error('Registry entry ' + path + ' already exists!');
                else
                    childWithLCP.value = value;
            } else if(lengthOfLCP < childWithLCP.key.length) { // A split is going to be required at lengthOfLCP - 1.
                entry.remove(childWithLCP.key);
                entry.add(childWithLCP.split(lengthOfLCP - 1));
            } else if(lengthOfLCP < path.length) { // Go deeper to inspect this child's children.
                path = path.slice(childWithLCP.key.length);
                entry = childWithLCP;
            }
        } else { // No common prefix was found, add the entry here.
            return entry.add(new RegistryEntry(entry.path, path, value));
        }
    }
}

Registry.prototype.find = function(path, match) {
    if(!new RegExp('^' + this.root.key, 'g').test(path))
        return null;

    let entry = this.root;

    if(path === this.root.path)
        return this.root;

    while(true) {
        let children      = entry.children.values(),
            stillPossible = false;

        for(let child of children) {
            let difference = Registry.difference(path, child.path);

            if(child.path.charAt(difference) === '*')
                for(let i = 0; i < child.path.substring(difference).length; i++) {
                    if(child.path.charAt(difference + 1) === path.charAt(difference + i)) {
                        if(Registry.difference(path.substring(difference + i), child.path.substring(difference + 1)) === -1) {
                            if(path.substring(difference + i) === child.path.substring(difference + 1)) {
                                return child;
                            } else {
                                stillPossible = true;
                                entry = child;
                            }
                        }
                    }
                }

            if(Registry.difference(path, child.path) === -1)
                if(path === child.path) {
                    return child;
                } else {
                    stillPossible = true;
                    entry = child;
                }
        }

        if(!stillPossible)
            return match ? null : entry;
    }
}

Registry.prototype.stringify = function() {
    return this.root.stringify(0, '');
}

module.exports = Registry;
