/**
 * @file Takes place database result and formats it for output
 * @author Robert Jones II <rjones@corporatewebimage.com>
 * @copyright Corporate Web Image, Inc. 2016
 **/
const appConfig = require('../../../config/config');
const formatAccountForOutput = require('../accounts/formatforoutput');
const formattourForOutput = require('../tours/formatforoutput');
//var PlaceType = require('../../enums/placetype');

/**
 * 
  * Formats place for output
  * @param model Place
  * @returns Object
  * 
**/

function formatPlaceForOutput(p, includeAdminFields) {

	const config = appConfig();
//	console.log(place.createdBy)
	//var SITE_URL = 'http://67.205.148.187:8080';
	const SITE_URL = 'http://localhost:8081';
	const place = {
		id: p._id,
	
		//parentId: p.parentId ? p.parentId : '',
		city: p.city ? p.city : '',
		info: p.info ? p.info : '',
		city_img: p.city_img ? p.city_img : '',
		//parent: formatPlaceForOutput(p.parentId, includeAdminFields),
		
		distance: p.distance ? p.distance : '',
		time: p.time ? p.time : '',
		featuredImageUrl: p.images.featured.path ? SITE_URL + '/uploads/places' + p.images.featured.path : '',
	};

	if (typeof  p.createdBy !== 'undefined') {
		place.creator = formatAccountForOutput(p.createdBy)
	}

	if (p.parentId) {
		place.parent = {
			id: p.parentId._id,
			
			city: p.parentId.city ? p.parentId.city : '',
			info: p.parentId.info ? p.parentId.info : '',
			distance: p.parentId.distance ? p.parentId.distance : '',
			//parent: formatPlaceForOutput(p.parentId, includeAdminFields),
			coordinates: { latitude: null, longitude: null },
			time: p.parentId.time ? p.parentId.time : ''
		}
	}
	if (p.location) {
		place.coordinates = {
			latitude: p.location.coordinates[1],
			longitude: p.location.coordinates[0]
		};
	} else if (p.coordinates) { // old way of storing lat/lng
		place.coordinates = {
			latitude: p.coordinates.latitude,
			longitude: p.coordinates.longitude
		};
	}
	if (includeAdminFields) {
		//place.type = p.type ? p.type : '';
		place.createdBy = p.createdBy;
		place.reviewStatus = p.reviewStatus;
	}

	return place;
}

module.exports = formatPlaceForOutput