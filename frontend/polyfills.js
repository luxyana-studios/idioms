// Polyfills for web compatibility
/* eslint-disable no-undef */

// Global polyfill for tslib __extends function
(function () {
  const globalThis = (function () {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof window !== 'undefined') return window;
    if (typeof global !== 'undefined') return global;
    if (typeof self !== 'undefined') return self;
    throw new Error('Unable to locate global object');
  })();

  // Polyfill __extends for tslib compatibility
  if (!globalThis.__extends) {
    globalThis.__extends = function (d, b) {
      for (var p in b)
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  }

  // Polyfill other tslib functions that might be needed
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
})();
