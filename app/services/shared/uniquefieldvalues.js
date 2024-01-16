/**
 * @file Finds unique field values from an array of objects
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/

function uniqueFieldValuesFromObjects(objects, field) {
    var uniqueValues={};

    objects.forEach(obj => {
        if ( ! obj[field]) return;

        var val = obj[field];
        if (Array.isArray(val)) {
            var vals = val;
            vals.forEach(val => {
                uniqueValues[val] = true;
            });
        } else {
            uniqueValues[val] = true;
        }

    });

    return Object.keys(uniqueValues);
}

module.exports = uniqueFieldValuesFromObjects