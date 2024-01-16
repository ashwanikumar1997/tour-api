/**
 * @file Takes a placeId URL param and adds a corresponding place to the request object
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 */
var Tour = require('../../models/tour');
var formatTourForOutput = require('../tours/formatforoutput');

function getToursBydestination(res, destinationId){
	Tour.find({destinationId: destinationId}, (err, tours) => {
		if (err) {
			return {
				success: false,
				message: "Internal error occurred when listing tours."
			};
		}
		var test = {tours: tours.map(tour => formatTourForOutput(tour))};
		//console.log({tours: tours.map(tour => formatTourForOutput(tour))})
		//return test.tours;
		//return ['test','heloo'];
		var data = {};
            data['tours'] = tours.map(function (tour) {
                return formatTourForOutput(tours);
            });
		//return [{tours: tours.map(tour => formatTourForOutput(tour))}];
		return data;
		//res.send({tours: tours.map(tour => formatTourForOutput(tour))});
	//	return {tour:{id:20}}
	});
}
module.exports = getToursBydestination