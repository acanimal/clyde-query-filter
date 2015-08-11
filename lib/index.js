"use strict";

var url = require("url"),
    util = require("util"),
    Qs = require("qs");


function BadRequest() {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.statusCode = 400;
  this.message = "Bad Request";
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


  function checkIfAny(configParamsArray, reqParams) {
    var i, length = configParamsArray.length;
    console.log("ReqParams ", reqParams);
    for(i=0; i< length; i++) {
      console.log("conf: ", configParamsArray[i]);
      if (reqParams[ configParamsArray[i] ] !== null) {
        return true;
      }
    }
    return false;
  }

  function checkIfAll(configParamsArray, reqParams) {
    // TODO : Implement
    return false;
  }


  return function(req, res, next) {

    var parsedUrl = url.parse(req.url);
    var reqParams = Qs.parse(parsedUrl.query);

    if (config.deny) {
      if (config.deny.all && !checkIfAll(config.deny.all, reqParams) ) {
        return BadRequestResponse(res);
      }
      if (config.deny.any && !checkIfAny(config.deny.any, reqParams) ) {
        return BadRequestResponse(res);
      }
      return next();
    }

    if(config.allow) {
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
