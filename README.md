# UR Query Filter

URL query filter implementation for Clyde API gateway. This filter allows or denies requests depending on its query parameters.

<!-- TOC depth:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [UR Query Filter](#ur-query-filter)
	- [Configuration](#configuration)
	- [Examples](#examples)
		- [Allow only requests that contains the parameters `a`, `b` and `c`.](#allow-only-requests-that-contains-the-parameters-a-b-and-c)
		- [Allow any request that contains any of the parameters `a`, `b` or `c`.](#allow-any-request-that-contains-any-of-the-parameters-a-b-or-c)
		- [Deny the requests that contains the parameters `a`, `b` and `c`.](#deny-the-requests-that-contains-the-parameters-a-b-and-c)
		- [Deny any request that contains any of the parameters `a`, `b` or `c`.](#deny-any-request-that-contains-any-of-the-parameters-a-b-or-c)
		- [Global cache with default configuration](#global-cache-with-default-configuration)
	- [Notes](#notes)
- [License](#license)
<!-- /TOC -->

## Configuration

The configuration is flexible enough so, given an array of parameters names, indicate if we can allow or deny the request depending on if all parameters or any are present in the request's query. The allows properties are:

* `allow`: Only accepts the requests that complies with the conditions.
* `deny`: Blocks all the request that complies with the condition.

In both cases conditions can be specified indicating an array of parameters names that must mach `all` or `any` with the request parameters.

## Examples

### Allow only requests that contains the parameters `a`, `b` and `c`.

```javascript
{
  prefilters: [
    {
      id: "query-filter",
      path: "clydeio-query-filter",
      config: {
        allow: {
          all: ["a", "b", "c"]
        }
      }
    }
  ],
  ...
}
```

### Allow any request that contains any of the parameters `a`, `b` or `c`.

```javascript
{
  prefilters: [
    {
      id: "query-filter",
      path: "clydeio-query-filter",
      config: {
        allow: {
          any: ["a", "b", "c"]
        }
      }
    }
  ],
  ...
}
```

### Deny the requests that contains the parameters `a`, `b` and `c`.

```javascript
{
  prefilters: [
    {
      id: "query-filter",
      path: "clydeio-query-filter",
      config: {
        deny: {
          all: ["a", "b", "c"]
        }
      }
    }
  ],
  ...
}
```

### Deny any request that contains any of the parameters `a`, `b` or `c`.

```javascript
{
  prefilters: [
    {
      id: "query-filter",
      path: "clydeio-query-filter",
      config: {
        deny: {
          any: ["a", "b", "c"]
        }
      }
    }
  ],
  ...
}
```

### Global cache with default configuration

## Notes

# License

The MIT License (MIT)

Copyright (c) 2015 Antonio Santiago (@acanimal)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[node-cache]: https://github.com/tcs-de/nodecache
