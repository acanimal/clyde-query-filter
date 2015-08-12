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


  describe("allow", function() {

    it("should allow pass the request because has some 'any' parameters", function(done) {
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
        .get("/foo?c")
        .expect(404, done);
    });


    it("should fail because the request does not have any of the required 'any' parameters", function(done) {
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
                any: ["a", "b"]
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
        .get("/foo?c&d")
        .expect(400, done);
    });

    it("should allow pass the request because has all the 'all' parameters", function(done) {
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
                all: ["a", "b", "c"]
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
        .get("/foo?a&b=10&c&d=hi")
        .expect(404, done);
    });


    it("should fail because the request does not have all the required 'all' parameters", function(done) {
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
                all: ["a", "b", "c"]
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
        .get("/foo?a&b&d")
        .expect(400, done);
    });

  });

  describe("deny", function() {

    it("should block the request because has some of the 'any' parameters", function(done) {
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
        .get("/foo?c")
        .expect(400, done);
    });


    it("should success because the request does not have any of the required 'any' parameters", function(done) {
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
                any: ["a", "b"]
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
        .get("/foo?c&d")
        .expect(404, done);
    });

    it("should block the request because the request has all the 'all' parameters", function(done) {
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
                all: ["a", "b", "c"]
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
        .get("/foo?a&b=10&c=hi&d")
        .expect(400, done);
    });


    it("should success because the request does not have all the required 'all' parameters", function(done) {
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
                all: ["a", "b", "c"]
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
        .get("/foo?a&b&d")
        .expect(404, done);
    });

  });

});
