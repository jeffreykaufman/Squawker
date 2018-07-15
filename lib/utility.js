'use strict';

function merge(...objects) {
    let mergedObject = new Object();

    objects.forEach(object => {
        Objects.keys(object).forEach(key => {
            if(!mergedObject.hasOwnProperty(key)) {
                Object.defineProperty(mergedObject, key, Object.getOwnPropertyDescriptor(object, key));

                if(typeof object[key] !== 'object') {
                    mergedObject[key] = object[key];
                }
            }

            if(typeof object[key] === 'object') {
                mergedObject[key] = merge(mergedObject[key], object[key]);
            }
        });
    });

    return mergedObject;
}

module.exports = {
    merge
};
