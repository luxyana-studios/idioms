/* eslint-disable */
// tslib replacement for web compatibility - following the exact structure of the original
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define('tslib', ['exports'], function (exports) {
      factory(createExporter(root, createExporter(exports)));
    });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    factory(createExporter(root, createExporter(module.exports)));
  } else {
    factory(createExporter(root));
  }
  function createExporter(exports, previous) {
    if (exports !== root) {
      if (typeof Object.create === 'function') {
        Object.defineProperty(exports, '__esModule', { value: true });
      } else {
        exports.__esModule = true;
      }
    }
    return function (id, v) {
      return (exports[id] = previous ? previous(id, v) : v);
    };
  }
})(
  function (exporter) {
    var __extends = function (d, b) {
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

    var __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };

    var __rest = function (s, e) {
      var t = {};
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
          t[p] = s[p];
      if (s != null && typeof Object.getOwnPropertySymbols === 'function')
        for (
          var i = 0, symbols = Object.getOwnPropertySymbols(s);
          i < symbols.length;
          i++
        ) {
          if (
            e.indexOf(symbols[i]) < 0 &&
            Object.prototype.propertyIsEnumerable.call(s, symbols[i])
          )
            t[symbols[i]] = s[symbols[i]];
        }
      return t;
    };

    var __decorate = function (decorators, target, key, desc) {
      var c = arguments.length,
        r =
          c < 3
            ? target
            : desc === null
              ? (desc = Object.getOwnPropertyDescriptor(target, key))
              : desc,
        d;
      if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
        r = Reflect.decorate(decorators, target, key, desc);
      else
        for (var i = decorators.length - 1; i >= 0; i--)
          if ((d = decorators[i]))
            r =
              (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return (c > 3 && r && Object.defineProperty(target, key, r), r);
    };

    var __param = function (paramIndex, decorator) {
      return function (target, key) {
        decorator(target, key, paramIndex);
      };
    };

    var __awaiter = function (thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P
          ? value
          : new P(function (resolve) {
              resolve(value);
            });
      }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator['throw'](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done
            ? resolve(result.value)
            : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };

    var __generator = function (thisArg, body) {
      var _ = {
          label: 0,
          sent: function () {
            if (t[0] & 1) throw t[1];
            return t[1];
          },
          trys: [],
          ops: [],
        },
        f,
        y,
        t,
        g;
      return (
        (g = { next: verb(0), throw: verb(1), return: verb(2) }),
        typeof Symbol === 'function' &&
          (g[Symbol.iterator] = function () {
            return this;
          }),
        g
      );
      function verb(n) {
        return function (v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError('Generator is already executing.');
        while (_)
          try {
            if (
              ((f = 1),
              y &&
                (t =
                  op[0] & 2
                    ? y['return']
                    : op[0]
                      ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                      : y.next) &&
                !(t = t.call(y, op[1])).done)
            )
              return t;
            if (((y = 0), t)) op = [op[0] & 2, t.value];
            switch (op[0]) {
              case 0:
              case 1:
                t = op;
                break;
              case 4:
                _.label++;
                return { value: op[1], done: false };
              case 5:
                _.label++;
                y = op[1];
                op = [0];
                continue;
              case 7:
                op = _.ops.pop();
                _.trys.pop();
                continue;
              default:
                if (
                  !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                  (op[0] === 6 || op[0] === 2)
                ) {
                  _ = 0;
                  continue;
                }
                if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                  _.label = op[1];
                  break;
                }
                if (op[0] === 6 && _.label < t[1]) {
                  _.label = t[1];
                  t = op;
                  break;
                }
                if (t && _.label < t[2]) {
                  _.label = t[2];
                  _.ops.push(op);
                  break;
                }
                if (t[2]) _.ops.pop();
                _.trys.pop();
                continue;
            }
            op = body.call(thisArg, _);
          } catch (e) {
            op = [6, e];
            y = 0;
          } finally {
            f = t = 0;
          }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };

    // Export the functions using the same pattern as the original tslib
    exporter('__extends', __extends);
    exporter('__assign', __assign);
    exporter('__rest', __rest);
    exporter('__decorate', __decorate);
    exporter('__param', __param);
    exporter('__awaiter', __awaiter);
    exporter('__generator', __generator);

    // Add other commonly used functions with stubs
    exporter('__exportStar', function (m, o) {
      for (var p in m)
        if (p !== 'default' && !Object.prototype.hasOwnProperty.call(o, p))
          o[p] = m[p];
    });
    exporter('__values', function (o) {
      var s = typeof Symbol === 'function' && Symbol.iterator,
        m = s && o[s],
        i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === 'number')
        return {
          next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
          },
        };
      throw new TypeError(
        s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.',
      );
    });
    exporter('__read', function (o, n) {
      var m = typeof Symbol === 'function' && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o),
        r,
        ar = [],
        e;
      try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
          ar.push(r.value);
      } catch (error) {
        e = { error: error };
      } finally {
        try {
          if (r && !r.done && (m = i['return'])) m.call(i);
        } finally {
          if (e) throw e.error;
        }
      }
      return ar;
    });
    exporter('__spreadArray', function (to, from, pack) {
      if (pack || arguments.length === 2)
        for (var i = 0, l = from.length, ar; i < l; i++) {
          if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
          }
        }
      return to.concat(ar || Array.prototype.slice.call(from));
    });
  },
  typeof global !== 'undefined'
    ? global
    : typeof globalThis !== 'undefined'
      ? globalThis
      : typeof window !== 'undefined'
        ? window
        : this || {},
);
