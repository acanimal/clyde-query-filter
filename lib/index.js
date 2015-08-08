"use strict";

var url = require("url");

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

  return function(req, res, next) {

  };

};
