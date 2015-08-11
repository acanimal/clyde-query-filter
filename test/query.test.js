"use strict";

var path = require("path"),
    request = require("supertest"),
    expect = require("chai").expect,
    http = require("http"),
    clyde = require("clydeio");


describe("cache", function() {

  var server;

  afterEach(function() {
    if(server) {
      server.close();
    }
  });


  it("should fail because no allow/deny option are supplied", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    try {
      clyde.createMiddleware(options);
    } catch(err) {
      expect(err.message).to.contains("query-filter");
      done();
    }
  });


  it("should fail because no any/all option are supplied within deny option", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            deny: {}
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    try {
      clyde.createMiddleware(options);
    } catch(err) {
      expect(err.message).to.contains("query-filter");
      done();
    }
  });


  it("should fail because both any/all options are supplied within deny option", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            deny: {
              all: [],
              any: []
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    try {
      clyde.createMiddleware(options);
    } catch(err) {
      expect(err.message).to.contains("query-filter");
      done();
    }
  });


  it("should fail because no any/all option are supplied within allow option", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            allow: {}
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    try {
      clyde.createMiddleware(options);
    } catch(err) {
      expect(err.message).to.contains("query-filter");
      done();
    }
  });


  it("should fail because both any/all options are supplied within allow option", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            allow: {
              all: [],
              any: []
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    try {
      clyde.createMiddleware(options);
    } catch(err) {
      expect(err.message).to.contains("query-filter");
      done();
    }
  });


  it("should allow pass the request because has some parameter", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "query-filter",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            allow: {
              any: ["a", "b", "c"]
            }
          }
        }
      ],

      providers: [
        {
          id: "id",
          context: "/provider",
          target: "http://localhost:8888"
        }
      ]
    };

    // Create server with clyde's middleware options
    var middleware = clyde.createMiddleware(options);
    server = http.createServer(middleware);
    server.listen(options.port);

    // Make request which expects a 404 error
    request("http://localhost:8888")
      .get("/foo?a")
      .expect(40, done);
  });


});
