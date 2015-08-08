"use strict";

var path = require("path"),
    request = require("supertest"),
    expect = require("chai").expect,
    http = require("http"),
    clyde = require("clydeio");


describe("cache", function() {

  var server;

  afterEach(function() {
    server.close();
  });


  it("should return data from cache", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "cache",
          path: path.join(__dirname, "../lib/index.js")
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
      .get("/foo?query=1")
      .end(function(err, res) {
        // .expect() doesn't work because we are getting a 404 error and using
        // the .end() method too. So we need to make by hand
        expect(res.statusCode).to.be.equal(404);
        expect(res.headers["x-cache"]).to.be.equal("MISS");

        // Make a second request
        request("http://localhost:8888")
          .get("/foo?query=1")
          .expect("X-Cache", "HIT")
          .expect(404, done);
      });
  });

  it("should return two MISS and cache data using the ignoreQuery property to false", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "cache",
          path: path.join(__dirname, "../lib/index.js"),
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
      .get("/foo?query=1")
      .end(function(err, res) {
        // .expect() doesn't work because we are getting a 404 error and using
        // the .end() method too. So we need to make by hand
        expect(res.statusCode).to.be.equal(404);
        expect(res.headers["x-cache"]).to.be.equal("MISS");

        // Make a second request
        request("http://localhost:8888")
          .get("/foo?query=2&param=a")
          .expect("X-Cache", "MISS")
          .expect(404, done);
      });
  });

  it("should return data from cache using the ignoreQuery property to true", function(done) {
    var options = {
      port: 8888,
      logfile: path.join(__dirname, "..", "tmp", "clyde.log"),
      loglevel: "info",

      prefilters: [
        {
          id: "cache",
          path: path.join(__dirname, "../lib/index.js"),
          config: {
            ignoreQuery: true
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
      .get("/foo?query=1")
      .end(function(err, res) {
        // .expect() doesn't work because we are getting a 404 error and using
        // the .end() method too. So we need to make by hand
        expect(res.statusCode).to.be.equal(404);
        expect(res.headers["x-cache"]).to.be.equal("MISS");

        // Make a second request
        request("http://localhost:8888")
          .get("/foo?query=2&param=a")
          .expect("X-Cache", "HIT")
          .expect(404, done);
      });
  });

});
