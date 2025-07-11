// Web-specific polyfills for expo-router and metro
/* eslint-disable */

// Ensure global object exists
if (typeof globalThis === 'undefined') {
  if (typeof window !== 'undefined') {
    window.globalThis = window;
  } else if (typeof global !== 'undefined') {
    global.globalThis = global;
  } else if (typeof self !== 'undefined') {
    self.globalThis = self;
  }
}

// Core tslib polyfills - the main ones causing issues
if (!globalThis.__extends) {
  globalThis.__extends = function (d, b) {
    for (var p in b)
      if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype =
      b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
  };
}

if (!globalThis.__assign) {
  globalThis.__assign = function () {
    globalThis.__assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return globalThis.__assign.apply(this, arguments);
  };
}

// Ensure tslib object is available
if (typeof window !== 'undefined') {
  window.tslib = window.tslib || {
    __extends: globalThis.__extends,
    __assign: globalThis.__assign,
  };
}
