/**
 * @file Calculate distance, in miles, between two coordinates
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/

function radians(distance) {
    var radianConversion = Math.PI / 180;
    return distance * radianConversion;
}
function distanceInMiles(distance) {
    var distanceConversion = 3959;
    return distance * distanceConversion;
}
function distanceMiles(coord1, coord2) {

    var dLat = radians(coord2.latitude - coord1.latitude);
    var dLng = radians(coord2.longitude - coord1.longitude);
    var lat1 = radians(coord1.latitude);
    var lat2 = radians(coord2.latitude);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return distanceInMiles(c);
}

module.exports = distanceMiles