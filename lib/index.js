"use strict";

var url = require("url"),
    Qs = require("qs");


/**
 * BadRequest error
 *
 * @constructor
 * @private
 */
function BadRequest() {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.statusCode = 400;
  this.message = "Bad Request";
}


/**
 * Check if any parameters specified in the 'any' configuration options are
 * present in the request.
 *
 * @private
 * @param  {Array} configParamsArray Array with the properties names.
 * @param  {Object} reqParams  Object with request params as key,value.
 * @returns {Boolean} True if all config parameters are present in the request. False otherwise.
 */
function checkIfAny(configParamsArray, reqParams) {
  var i, length = configParamsArray.length;
  for ( i = 0; i < length; i++ ) {
    if (typeof reqParams[ configParamsArray[i] ] !== "undefined") {
      return true;
    }
  }
  return false;
}


/**
 * Check if all parameters specified in the 'all' configuration options are
 * present in the request.
 *
 * @private
 * @param  {Array} configParamsArray Array with the properties names.
 * @param  {Object} reqParams  Object with request params as key,value.
 * @returns {Boolean} True if all config parameters are present in the request. False otherwise.
 */
function checkIfAll(configParamsArray, reqParams) {
  return configParamsArray.every(function(current) {
    return (typeof reqParams[ current ] !== "undefined");
  });
}


/**
 * Query filter
 *
 * @public
 * @param  {String} id Identifier of the filter
 * @param  {Object} config JavaScript object with filter configuration
 * @returns {Function} Middleware function implementing the filter.
 */
module.exports.init = function(id, config) {

  // Ensure we have a config object
  config = config || {};

  // Check configuration
  if (!config || (!config.deny && !config.allow) ) {
    throw new Error("'query-filter': Invalid filter parameters !!! At least one option allow/deny must by supplied.");
  }
  if (config.deny && !config.deny.all && !config.deny.any ) {
    throw new Error("'query-filter': One any/all option is required within the deny section.");
  }
  if (config.deny && config.deny.all && config.deny.any ) {
    throw new Error("'query-filter': Only one any/all option can be specified within the deny section.");
  }
  if (config.allow && !config.allow.all && !config.allow.any ) {
    throw new Error("'query-filter': One any/all option is required within the allow section.");
  }
  if (config.allow && config.allow.all && config.allow.any ) {
    throw new Error("'query-filter': Only one any/all option can be specified within the allow section.");
  }

  // Middleware
  return function(req, res, next) {

    var parsedUrl = url.parse(req.url);
    var reqParams = Qs.parse(parsedUrl.query);

    if (config.deny) {
      if (config.deny.all && checkIfAll(config.deny.all, reqParams) ) {
        return next(new BadRequest());
      }
      if (config.deny.any && checkIfAny(config.deny.any, reqParams) ) {
        return next(new BadRequest());
      }
      return next();
    }

    if (config.allow) {
      if (config.allow.all && !checkIfAll(config.allow.all, reqParams) ) {
        return next(new BadRequest());
      }
      if (config.allow.any && !checkIfAny(config.allow.any, reqParams) ) {
        return next(new BadRequest());
      }
      return next();
    }

    // We should not arrive here !!!
    throw new Error("'query-filter': We should not arrive here. The filter has a bug.");
  };

};
