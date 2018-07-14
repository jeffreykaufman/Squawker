'use strict';

function RegistryEntry(prefix, key, value) {
    this.prefix   = prefix;
    this.key      = key;
    this.value    = value;

    this.children = new Map();
    this.path     = prefix ? prefix + key : key;
}

RegistryEntry.prototype.add = function(entry) {
    this.children.set(entry.key, entry);
    return entry;
}

RegistryEntry.prototype.remove = function(key) {
    this.children.delete(key);
    return true;
}

RegistryEntry.prototype.split = function(index) {
    let parent = new RegistryEntry(this.prefix, this.key.slice(0, index, null), null);
    parent.add(new RegistryEntry(parent.path, this.key.slice(index), this.value));
    return parent;
}

RegistryEntry.prototype.stringify = function(depth, previous) {
    let str   = this.key + (this.value ? ' *' : ''),
        count = 0;

    for(let iterate of this.children.values()) {
        if(count < this.children.size - 1)
            str += '\n' + previous + '├── ' + iterate.stringify(depth + 1, previous + '│   ');
        else
            str += '\n' + previous + '└── ' + iterate.stringify(depth + 1, previous + '    ');
        count++;
    }

    return str;
}

module.exports = RegistryEntry;
