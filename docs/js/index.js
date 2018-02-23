(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.dat = factory());
}(this, (function () { 'use strict';

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);

  return css;
}

function colorToString (color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};

var INTERPRETATIONS = [
{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
},
{
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
},
{
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
},
{
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck(this, ColorController);
    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function ()        {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function ()        {
      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid transparent}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  Object.defineProperties(this,
  {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRowName) {
          titleRowName.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    params.closed = false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var _titleRowName = document.createTextNode(params.name);
    dom.addClass(_titleRowName, 'controller-name');
    var titleRow = addRow(_this, _titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype,
{
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller,                                   {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var index = {
  color: {
    Color: Color,
    math: ColorMath,
    interpret: interpret
  },
  controllers: {
    Controller: Controller,
    BooleanController: BooleanController,
    OptionController: OptionController,
    StringController: StringController,
    NumberController: NumberController,
    NumberControllerBox: NumberControllerBox,
    NumberControllerSlider: NumberControllerSlider,
    FunctionController: FunctionController,
    ColorController: ColorController
  },
  dom: {
    dom: dom
  },
  gui: {
    GUI: GUI
  },
  GUI: GUI
};

return index;

})));


},{}],2:[function(require,module,exports){
var CanvasHandler,CanvasHandlerPromise;CanvasHandlerPromise=require("./CanvasHandlerPromise.coffee"),CanvasHandler=function(){function CanvasHandler(props1){this.props=props1,this.paintQueue=new CanvasHandlerPromise({canvasHandler:this,promiseLabels:[]},null,function(){}),$(document).ready(function(_this){return function(){return _this.updateCanvas(),_this.flush()}}(this))}return CanvasHandler.prototype.canvas=null,CanvasHandler.prototype.paintQueue=null,CanvasHandler.prototype.props=null,CanvasHandler.prototype.flush=function(){return this.canvas.update(),this.paintQueue.execute(this.canvas)},CanvasHandler.prototype.ready=function(){return this.paintQueue},CanvasHandler.prototype.updateCanvas=function(){var c,ctx,handleMouseDown,handleMouseMove,handleMouseOut,handleMouseUp,isDragging,isRealDrag,lastDownT,mouseStartX,mouseStartY,props;return c=$(this.props.id),isDragging=!1,isRealDrag=!1,lastDownT=-1,mouseStartX=0,mouseStartY=0,handleMouseDown=function(e){var canMouseX,canMouseY,canvasHeight,canvasOffset,canvasWidth,offsetX,offsetY;if(canvasOffset=c.offset(),offsetX=canvasOffset.left,offsetY=canvasOffset.top,canvasWidth=c.width(),canvasHeight=c.height(),canMouseX=parseInt(e.clientX-offsetX),canMouseY=parseInt(e.clientY-offsetY),!isDragging)return mouseStartX=canMouseX,mouseStartY=canMouseY,lastDownT=+new Date,isDragging=!0},handleMouseUp=function(_this){return function(e){var canMouseX,canMouseY,canvasHeight,canvasOffset,canvasWidth,mouseRelX,mouseRelY,mouseXCanvas,mouseYCanvas,offsetX,offsetY;return canvasOffset=c.offset(),offsetX=canvasOffset.left,offsetY=canvasOffset.top,canvasWidth=c.width(),canvasHeight=c.height(),canMouseX=parseInt(e.clientX-offsetX),canMouseY=parseInt(e.clientY-offsetY),mouseStartX=0,mouseStartY=0,mouseRelX=canMouseX/canvasWidth,mouseRelY=canMouseY/canvasHeight,mouseXCanvas=canMouseX-_this.canvas.shiftX,mouseYCanvas=canMouseY-_this.canvas.shiftY,isRealDrag||_this.props.onClick&&_this.props.onClick(mouseXCanvas,mouseYCanvas,_this),isDragging=!1,lastDownT=-1}}(this),handleMouseOut=function(e){var canMouseX,canMouseY,canvasHeight,canvasOffset,canvasWidth,offsetX,offsetY;return canvasOffset=c.offset(),offsetX=canvasOffset.left,offsetY=canvasOffset.top,canvasWidth=c.width(),canvasHeight=c.height(),canMouseX=parseInt(e.clientX-offsetX),canMouseY=parseInt(e.clientY-offsetY),mouseStartX=0,mouseStartY=0},handleMouseMove=function(_this){return function(e){var canMouseX,canMouseY,canvasHeight,canvasOffset,canvasWidth,mouseDeltaRelX,mouseDeltaRelY,mouseDeltaX,mouseDeltaXCanvas,mouseDeltaY,mouseDeltaYCanvas,offsetX,offsetY;if(canvasOffset=c.offset(),offsetX=canvasOffset.left,offsetY=canvasOffset.top,canvasWidth=c.width(),canvasHeight=c.height(),canMouseX=parseInt(e.clientX-offsetX),canMouseY=parseInt(e.clientY-offsetY),mouseDeltaX=canMouseX-mouseStartX,mouseDeltaY=canMouseY-mouseStartY,mouseDeltaRelX=mouseDeltaX/canvasWidth,mouseDeltaRelY=mouseDeltaY/canvasHeight,mouseDeltaXCanvas=canMouseX-_this.canvas.shiftX,mouseDeltaYCanvas=canMouseY-_this.canvas.shiftY,_this.props.onMove&&_this.props.onMove(mouseDeltaXCanvas,mouseDeltaYCanvas,_this),isRealDrag=!1,isDragging?lastDownT>0&&+new Date-lastDownT>150&&(isRealDrag=!0):isRealDrag=!1,isRealDrag&&_this.props.onDrag)return _this.props.onDrag(mouseDeltaRelX,mouseDeltaRelY,_this,{endX:canMouseX,endY:canMouseY,startX:mouseStartX,startY:mouseStartY})}}(this),c.mousedown(function(e){return handleMouseDown(e)}),c.mousemove(function(e){return handleMouseMove(e)}),c.mouseup(function(e){return handleMouseUp(e)}),c.mouseout(function(e){return handleMouseOut(e)}),ctx=c[0].getContext("2d"),props=this.props,this.canvas={x:ctx,dom:c,w:0,h:0,shiftX:0,shiftY:0,update:function(){return this.w=props.w(),this.h=props.h(),this.x.canvas.width=this.w,this.x.canvas.height=this.h}},this.canvas.update()},CanvasHandler.prototype.moveBy=function(x,y){return this.canvas.shiftX+=x,this.canvas.shiftY+=y},CanvasHandler.prototype.moveTo=function(x,y){return this.canvas.shiftX=x,this.canvas.shiftY=y},CanvasHandler}(),module.exports=CanvasHandler;

},{"./CanvasHandlerPromise.coffee":3}],3:[function(require,module,exports){
var CanvasHandlerPromise,waitForFinalEvent;waitForFinalEvent=function(){var timers;return timers={},function(callback,ms,uniqueId){return uniqueId||(uniqueId="Don't call this twice without a uniqueId"),timers[uniqueId]&&clearTimeout(timers[uniqueId]),timers[uniqueId]=setTimeout(callback,ms)}}(),CanvasHandlerPromise=function(){function CanvasHandlerPromise(root,parent,bodyFn){this.root=root,this.bodyFn=bodyFn}return CanvasHandlerPromise.prototype.bodyFn=null,CanvasHandlerPromise.prototype.next=null,CanvasHandlerPromise.prototype.root=null,CanvasHandlerPromise.prototype.flush=function(){return this.root.canvasHandler.flush()},CanvasHandlerPromise.prototype.call=function(label){var tgt;return tgt=this.root.promiseLabels[label],null!=tgt?this.next=tgt:this},CanvasHandlerPromise.prototype.label=function(label){return this.root.promiseLabels[label]=this},CanvasHandlerPromise.prototype.workOn=function(label){var tgt;return tgt=this.root.promiseLabels[label],null!=tgt?tgt:this},CanvasHandlerPromise.prototype.on=function(obj,event){var capturedCanvas;return capturedCanvas=null,this.next=new CanvasHandlerPromise(this.root,this,function(c){return capturedCanvas=c}),$(obj).on(event,function(_this){return function(){return waitForFinalEvent(function(){if(null!=capturedCanvas)return capturedCanvas.update(),_this.next.execute(capturedCanvas)},500,"CHPromiseWindowResize")}}(this)),this.next},CanvasHandlerPromise.prototype.paint=function(fn){return this.next=new CanvasHandlerPromise(this.root,this,fn)},CanvasHandlerPromise.prototype.execute=function(c){var ref,ref1,ref2;return null==c&&(c=null!=(ref=this.root)&&null!=(ref1=ref.canvasHandler)?ref1.canvas:void 0),null!=this.bodyFn&&(null!=this.bodyFn.paint?this.bodyFn.paint(c):this.bodyFn(c)),null!=(ref2=this.next)?ref2.execute(c):void 0},CanvasHandlerPromise}(),module.exports=CanvasHandlerPromise;

},{}],4:[function(require,module,exports){
var GOLCompiler,aliveColour,deadColour,golUtils,uniqueArray;aliveColour=[[230,230,230,1],[31,141,214,1],[233,50,45,1],[97,204,79,1],[139,160,30,1],[160,91,30,1],[30,160,155,1]],deadColour=[66,66,66,.1],uniqueArray=function(arr){var a,i,j,k,m,ref,ref1,ref2;for(a=arr.concat(),i=k=0,ref=a.length-1;ref>=k;i=k+=1)for(j=m=ref1=i+1,ref2=a.length-1;ref2>=m;j=m+=1)a[i]===a[j]&&a.splice(j--,1);return a},golUtils={count:function(l){return l.length},rangeCircle:function(map,x0,y0,r){var k,m,ref,ref1,ref2,ref3,ret,x,y;for(ret=[],x=k=ref=x0-r,ref1=x0+r;ref1>=k;x=k+=1)for(y=m=ref2=y0-r,ref3=y0+r;ref3>=m;y=m+=1)(x-x0)*(x-x0)+(y-y0)*(y-y0)>r*r||null!=map[x]&&null!=map[x][y]&&ret.push(map[x][y]);return ret},rangeDistStraight:function(map,x0,y0,r){var k,m,ref,ref1,ref2,ref3,ret,x,y;for(ret=[],x=k=ref=x0-r,ref1=x0+r;ref1>=k;x=k+=1)for(y=m=ref2=y0-r,ref3=y0+r;ref3>=m;y=m+=1)(x-x0)*(x-x0)+(y-y0)*(y-y0)===r*r&&null!=map[x]&&null!=map[x][y]&&ret.push(map[x][y]);return ret},rangeDist:function(map,x0,y0,r){var d,k,m,ref,ref1,ref2,ref3,ret,x,y;for(ret=[],x=k=ref=x0-r,ref1=x0+r;ref1>=k;x=k+=1)for(y=m=ref2=y0-r,ref3=y0+r;ref3>=m;y=m+=1)d=(x-x0)*(x-x0)+(y-y0)*(y-y0),d>=r*r&&(r+1)*(r+1)>d&&null!=map[x]&&null!=map[x][y]&&ret.push(map[x][y]);return ret},filter:function(l,p){return l.filter(p)}},GOLCompiler=function(){function GOLCompiler(){}return GOLCompiler.prototype.compile=function(code){var A,B,C,alias,code_without_decl,conditioner,defaultDecl,defaultStateDecl,dir,dir1,dir2,e,fn,i,k,len,len1,len2,len3,len4,len5,m,match,matchDecl,matchStatesDecl,n,ncode,noelse,o,prfdecl,prfdecl_decls,q,revcode,s,spl,statesNames,statesNamesAliases,sufdecl,varDecls;if(revcode=code.split("\n").reverse().join("\n"),ncode="",defaultDecl=null,defaultStateDecl=/^([ a-zA-Z0-9\[\]]+?)$/gm,match=defaultStateDecl.exec(revcode),null!==match&&(defaultDecl=match[0],code+="\n"+defaultDecl+": true\n"),match=defaultStateDecl.exec(revcode),null!==match)throw Error("Multiple default value declarations.");for(matchDecl=/^([ a-zA-Z0-9\<\-\>,\[\]]+?)(:(.*))?$/gm,match=matchDecl.exec(code),varDecls="";null!==match;)match[1].indexOf("set ")!==-1?(spl=match[1].split(" ")[1],varDecls+="var "+spl+" = "+match[3]+";\n"):ncode+=null==match[3]?match[1]+": true\n":""===match[3].trim()?match[1]+": true\n":match[1]+": "+match[3]+"\n",match=matchDecl.exec(code);for(matchStatesDecl=/^([ a-zA-Z0-9\<\-\>,\[\]]+?)(:(.*))$/gm,code=ncode,statesNames=[],statesNamesAliases={},match=matchStatesDecl.exec(code);null!==match;)statesNames=uniqueArray(statesNames.concat(match[1].split(/->|,/g))),match=matchStatesDecl.exec(code);if(statesNames=statesNames.sort(function(a,b){return a.length===b.length?b-a:b.length-a.length}),null!==defaultDecl)for(statesNamesAliases[defaultDecl]=0,i=1,k=0,len=statesNames.length;len>k;k++)alias=statesNames[k],alias!==defaultDecl&&(statesNamesAliases[alias]=i,++i);else for(i=0,m=0,len1=statesNames.length;len1>m;m++)alias=statesNames[m],statesNamesAliases[alias]=i,++i;for(match=matchStatesDecl.exec(code),ncode="";null!==match;){if(dir=match[1].split("->"),C=match[3].trim(),2===dir.length)for(dir1=dir[0].split(","),dir2=dir[1].split(","),n=0,len2=dir1.length;len2>n;n++)for(A=dir1[n],o=0,len3=dir2.length;len3>o;o++)B=dir2[o],ncode+=B+": is("+A+") && ("+C+")\n";else for(dir1=dir[0].split(","),q=0,len4=dir1.length;len4>q;q++)A=dir1[q],ncode+=A+": "+C+"\n";match=matchStatesDecl.exec(code)}for(code=ncode,match=matchStatesDecl.exec(code),ncode="",noelse=!0;null!==match;)B=match[3].trim(),A=match[1].trim(),noelse||(ncode+="else "),ncode+="if("+B+") {return ("+A+");}\n",match=matchStatesDecl.exec(code),noelse=!1;for(code=ncode,sufdecl="return self;",prfdecl="",s=0,len5=statesNames.length;len5>s;s++)alias=statesNames[s],prfdecl+="var "+alias+" = "+statesNamesAliases[alias]+";\n";prfdecl_decls="var self = map[x][y];\nvar get = function(x0, y0) {\n  if(map[x0] === undefined) {\n    return null;\n  }\n  if(map[x0][y0] === undefined) {\n    return null;\n  }\n  return map[x0][y0];\n};\nvar filterValue = function(t, v) { return t.filter(function(e){return e === v;}); };\nvar circle = function(r) { return golUtils.rangeCircle(map,x,y,r); };\nvar countCircleValues = function(r, v) { return (filterValue(circle(r),v)).length; };\nvar range = function(r) { return golUtils.rangeDist(map,x,y,r); };\nvar countRangeValues = function(r, v) { return (filterValue(range(r),v)).length; };\nvar rangeStraight = function(r) { return golUtils.rangeDistStraight(map,x,y,r); };\nvar countRangeStraightValues = function(r, v) { return (filterValue(rangeStraight(r),v)).length; };\nvar is = function(o, value) {\n  if(value === undefined) {\n    return map[x][y] === o;\n  }\n  return o === value;\n};\nvar $ = function(xr, yr) { return map[xr+x][yr+y]; };",code_without_decl=prfdecl+"\n"+varDecls+code+sufdecl,code=prfdecl+prfdecl_decls+"\n"+varDecls+code+sufdecl,conditioner={colour:function(v){var colIndex;return v%=this.states,colIndex=v%aliveColour.length,null==aliveColour[colIndex]&&(colIndex=0),[aliveColour[colIndex][0],aliveColour[colIndex][1],aliveColour[colIndex][2],aliveColour[colIndex][3]]}},conditioner.translateStateID=function(id){var kid,kname;for(kname in statesNamesAliases)if(kid=statesNamesAliases[kname],id===kid)return kname;return"Unknown"},conditioner.translateStateName=function(name){return null==statesNamesAliases[name]?0:statesNamesAliases[name]},conditioner.states=statesNames.length,code="(function(x, y, map){\n"+code+"})",fn=null;try{fn=eval(code)}catch(error){throw e=error,Error("Internal "+e)}return conditioner.step=fn,conditioner},GOLCompiler}(),module.exports=new GOLCompiler;

},{}],5:[function(require,module,exports){
var GOLMap;GOLMap=function(){function GOLMap(w1,h1,lifeObj){this.w=w1,this.h=h1,this.lifeObj=lifeObj,this.initialize()}return GOLMap.prototype.stepLock=!1,GOLMap.prototype.map=null,GOLMap.prototype.metadata=null,GOLMap.prototype.mapBuffer=null,GOLMap.prototype.alphaMask=null,GOLMap.prototype.mousePasteStructure=null,GOLMap.prototype.displayMode="normal",GOLMap.prototype.w=0,GOLMap.prototype.h=0,GOLMap.prototype.field_w=0,GOLMap.prototype.field_h=0,GOLMap.prototype.lifeObj=null,GOLMap.prototype.hoverListener=null,GOLMap.prototype.ltype=null,GOLMap.prototype.simTime=0,GOLMap.prototype.lastMouseMovePosX=0,GOLMap.prototype.lastMouseMovePosY=0,GOLMap.prototype.hoveredFieldX=0,GOLMap.prototype.hoveredFieldY=0,GOLMap.prototype.selectBox=null,GOLMap.prototype.lastMouseMoveC=null,GOLMap.prototype.initMetadataMatrix=function(){var l,m,ref,ref1,v,x,y;for(v=[],x=l=0,ref=this.w;ref>=l;x=l+=1)for(v.push([]),y=m=0,ref1=this.h;ref1>=m;y=m+=1)v[x].push({timeChanged:0,lastState:0});return v},GOLMap.prototype.initMatrix=function(){var l,m,ref,ref1,v,x,y;for(v=[],x=l=0,ref=this.w;ref>=l;x=l+=1)for(v.push([]),y=m=0,ref1=this.h;ref1>=m;y=m+=1)v[x].push(0);return v},GOLMap.prototype.setDisplayMode=function(type){return this.displayMode=type},GOLMap.prototype.getDisplayMode=function(){return this.displayMode},GOLMap.prototype.initialize=function(){var f_x,f_y,fi,fi_lower_l,fi_lower_rl,fi_upper_l,fi_upper_rl,l,map_c_x,map_c_y,map_maxd,ref,results,x,y;for(this.simTime=0,this.map=this.initMatrix(),this.mapBuffer=this.initMatrix(),this.alphaMask=this.initMatrix(),this.metadata=this.initMetadataMatrix(),map_c_x=this.w/2,map_c_y=this.h/2,f_x=1,f_y=3,fi_lower_l=0,fi_upper_l=1,fi_upper_rl=.9,fi_lower_rl=0,map_maxd=.7*Math.sqrt(f_x*map_c_x*map_c_x+f_y*map_c_y*map_c_y+.1),results=[],x=l=0,ref=this.w;ref>=l;x=l+=1)results.push(function(){var m,ref1,results1;for(results1=[],y=m=0,ref1=this.h;ref1>=m;y=m+=1)fi=1-Math.sqrt(f_x*(x-map_c_x)*(x-map_c_x)+f_y*(y-map_c_y)*(y-map_c_y))/map_maxd,fi>fi_upper_rl&&(fi=fi_upper_l),fi_lower_rl>fi&&(fi=fi_lower_l),fi=Math.max(fi_lower_l,fi),fi=Math.min(fi_upper_l,fi),results1.push(this.alphaMask[x][y]=1);return results1}.call(this));return results},GOLMap.prototype.reset=function(){return this.initialize()},GOLMap.prototype.saveSession=function(){var clonedAlphaMask,clonedMap,clonedMetadata,k,l,m,ref,ref1,ref2,v,x,y;for(this.stepLock=!0,clonedMap=this.initMatrix(),clonedAlphaMask=this.initMatrix(),clonedMetadata=this.initMatrix(),x=l=0,ref=this.w;ref>=l;x=l+=1)for(y=m=0,ref1=this.h;ref1>=m;y=m+=1){clonedMetadata[x][y]={},ref2=this.metadata[x][y];for(k in ref2)v=ref2[k],clonedMetadata[x][y][k]=v;clonedMap[x][y]=this.map[x][y],clonedAlphaMask[x][y]=this.alphaMask[x][y]}return this.stepLock=!1,{map:clonedMap,metadata:clonedMetadata,alphaMask:clonedAlphaMask,ltype:this.ltype}},GOLMap.prototype.loadSession=function(sess){var simTime;return this.stepLock=!0,simTime=this.simTime,this.initialize(),this.simTime=simTime,null!=sess.map&&(this.map=sess.map),null!=sess.metadata&&(this.metadata=sess.metadata),this.mapBuffer=this.initMatrix(),null!=sess.alphaMask&&(this.alphaMask=sess.alphaMask),this.ltype=sess.ltype,this.stepLock=!1,this.stepBuf()},GOLMap.prototype.onFieldHover=function(fn){return this.hoverListener=fn},GOLMap.prototype.clear=function(){var l,ref,results,x,y;for(results=[],x=l=0,ref=this.w;ref>=l;x=l+=1)results.push(function(){var m,ref1,results1;for(results1=[],y=m=0,ref1=this.h;ref1>=m;y=m+=1)this.map[x][y]=0,results1.push(this.mapBuffer[x][y]=0);return results1}.call(this));return results},GOLMap.prototype.setValue=function(x,y,val){return!this.stepLock&&(null!=this.map[x]&&null!=this.map[x][y]?(this.map[x][y]!==val&&(this.metadata[x][y].lastState=this.map[x][y],this.metadata[x][y].timeChanged=this.simTime),this.map[x][y]=val):void 0)},GOLMap.prototype.set=function(x,y,name){return!this.stepLock&&this.setValue(x,y,this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateName(name))},GOLMap.prototype.drawStructure=function(x,y,struct){var pos,results,typeName;if(this.stepLock)return!1;results=[];for(pos in struct)typeName=struct[pos],pos=pos.split("x"),results.push(this.set(parseInt(pos[0])+x,parseInt(pos[1])+y,typeName));return results},GOLMap.prototype.stepBuf=function(){var l,ref,results,x,y;for(results=[],x=l=0,ref=this.w;ref>=l;x=l+=1)results.push(function(){var m,ref1,results1;for(results1=[],y=m=0,ref1=this.h;ref1>=m;y=m+=1)results1.push(this.mapBuffer[x][y]=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.step(x,y,this.map));return results1}.call(this));return results},GOLMap.prototype.step=function(movx,movy){var l,m,ref,ref1,ref2,ref3,x,y;if(this.stepLock)return!1;for(++this.simTime,null==movx&&(movx=0),null==movy&&(movy=0),this.stepBuf(),x=l=ref=movx,ref1=this.w-movx;ref1>=l;x=l+=1)for(y=m=ref2=movy,ref3=this.h-movy;ref3>=m;y=m+=1)this.map[x][y]!==this.mapBuffer[x+movx][y+movy]&&(this.metadata[x][y].lastState=this.map[x][y],this.metadata[x][y].timeChanged=this.simTime),this.map[x][y]=this.mapBuffer[x+movx][y+movy];return null!=this.lastMouseMoveC?this.onMouseMove(this.lastMouseMovePosX,this.lastMouseMovePosY,this.lastMouseMoveC):void 0},GOLMap.prototype.onMouseMove=function(x,y,c){var field_x,field_x_abs,field_y,field_y_abs,toth,totw;if(totw=this.field_w*this.w,toth=this.field_h*this.h,field_x=Math.ceil((x-(c.canvas.w-totw)/2)/this.field_w),field_y=Math.ceil((y-(c.canvas.h-toth)/2)/this.field_h),field_x_abs=(x-1)*this.field_w+c.canvas.shiftX+(c.canvas.w-totw)/2,field_y_abs=(y-1)*this.field_h+c.canvas.shiftY+(c.canvas.h-toth)/2,this.hoveredFieldX=field_x,this.hoveredFieldY=field_y,this.lastMouseMovePosX=x,this.lastMouseMovePosY=y,this.lastMouseMoveC=c,c.flush(),null!=this.hoverListener)return this.hoverListener(this.hoveredFieldX,this.hoveredFieldY,field_x_abs,field_y_abs,this.getMetadata(field_x,field_y,c))},GOLMap.prototype.getMetadata=function(x,y,c){var field_x_abs,field_y_abs,state,stateName,toth,totw;return null==c&&(c=null),totw=this.field_w*this.w,toth=this.field_h*this.h,field_x_abs=null,field_y_abs=null,null!==c&&(field_x_abs=(x-1)*this.field_w+c.canvas.shiftX+(c.canvas.w-totw)/2,field_y_abs=(y-1)*this.field_h+c.canvas.shiftY+(c.canvas.h-toth)/2),state=this.map[x][y],stateName=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateID(state),{x:x,y:y,absX:field_x_abs,absY:field_y_abs,state:state,stateName:stateName,type:this.lifeObj.type,color:this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(this.map[x][y]),timeChanged:this.metadata[x][y].timeChanged,timeCurrent:this.simTime,lastState:this.metadata[x][y].lastState,lastStateName:this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateID(this.metadata[x][y].lastState)}},GOLMap.prototype.randomizeABit=function(strength,value){var box_x_rng,box_y_rng,i,j,l,num,prb,ref,results,x0,y0;if(this.stepLock)return!1;for(box_x_rng=[0,80],box_y_rng=[0,80],prb=50*Math.random()+50,results=[],j=l=0,ref=prb;ref>=l;j=l+=1)num=Math.random()*strength+10,results.push(function(){var m,ref1,results1;for(results1=[],i=m=0,ref1=num;ref1>=m;i=m+=1)Math.random()>.5?(x0=Math.random()*(box_x_rng[1]-box_x_rng[0])+box_x_rng[0],y0=Math.random()*(box_y_rng[1]-box_y_rng[0])+box_y_rng[0],x0=parseInt(x0),y0=parseInt(y0),results1.push(this.set(x0,y0,value))):results1.push(void 0);return results1}.call(this));return results},GOLMap.prototype.getStructFromSelectBox=function(){var l,m,maxX,maxY,minX,minY,n,o,ref,ref1,ref2,ref3,ref4,ref5,ref6,ref7,shiftX,shiftY,struct,x,y;if(null==this.selectBox)return{};for(struct={},maxX=-1e6,maxY=-1e6,minX=1e6,minY=1e6,x=l=ref=this.selectBox.startX,ref1=this.selectBox.endX;ref1>=l;x=l+=1)for(y=m=ref2=this.selectBox.startY,ref3=this.selectBox.endY;ref3>=m;y=m+=1)0!==this.map[x][y]&&(maxX=Math.max(x,maxX),maxY=Math.max(y,maxY),minX=Math.min(x,minX),minY=Math.min(y,minY));for(shiftX=-minX,shiftY=-minY,x=n=ref4=this.selectBox.startX,ref5=this.selectBox.endX;ref5>=n;x=n+=1)for(y=o=ref6=this.selectBox.startY,ref7=this.selectBox.endY;ref7>=o;y=o+=1)0!==this.map[x][y]&&(struct[x+shiftX+"x"+(y+shiftY)]=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateID(this.map[x][y]));return struct},GOLMap.prototype.countNodesInSelectBox=function(){var l,m,nodesCount,ref,ref1,ref2,ref3,x,y;if(null==this.selectBox)return 0;for(nodesCount=0,x=l=ref=this.selectBox.startX,ref1=this.selectBox.endX;ref1>=l;x=l+=1)for(y=m=ref2=this.selectBox.startY,ref3=this.selectBox.endY;ref3>=m;y=m+=1)0!==this.map[x][y]&&++nodesCount;return nodesCount},GOLMap.prototype.getSelectBox=function(){return this.selectBox},GOLMap.prototype.setSelectBox=function(posA,posB){return null==posA?(this.selectBox=null,!1):null==posB?(this.selectBox=null,!1):this.selectBox={startX:posA[0],startY:posA[1],endX:posB[0],endY:posB[1],width:posB[0]-posA[0],height:posB[1]-posB[1]}},GOLMap.prototype.canvasXYToBoardXY=function(x,y,c){var field_x,field_y,toth,totw;return totw=this.field_w*this.w,toth=this.field_h*this.h,field_x=Math.ceil((x-(c.canvas.w-totw)/2)/this.field_w),field_y=Math.ceil((y-(c.canvas.h-toth)/2)/this.field_h),[field_x-c.canvas.shiftX,field_y-c.canvas.shiftY]},GOLMap.prototype.setPastedStructure=function(struct){if(this.mousePasteStructure=struct,null==struct)return this.mousePasteStructure=null},GOLMap.prototype.paintPreview=function(c,struct){var fieldShiftX,fieldShiftY,field_h,field_margin_left,field_margin_top,field_rh,field_rw,field_w,h,l,m,maxX,maxY,minX,minY,pos,ref,ref1,results,rgba,shift_x,shift_y,toth,totw,typeName,w,x,y,zoom;if(null==struct)return!1;c.x.fillStyle="rgba(0, 45, 66, 0.1)",c.x.fillRect(0,0,c.w,c.height),w=10,h=10,fieldShiftX=4,fieldShiftY=4,minX=1e6,minY=1e6,maxX=-1e6,maxY=-1e6;for(pos in struct)typeName=struct[pos],pos=pos.split("x"),minX=Math.min(parseInt(pos[0]),minX),maxX=Math.max(parseInt(pos[0]),maxX),minY=Math.min(parseInt(pos[1]),minY),maxY=Math.max(parseInt(pos[1]),maxY);for(fieldShiftX=-minX+5,fieldShiftY=-minY+5,w=Math.abs(maxX-minX+10),h=Math.abs(maxY-minY+10),w=Math.max(w,h),h=w,zoom=1,field_margin_left=0,field_margin_top=0,field_w=c.w*zoom/w,field_h=c.h*zoom/h,field_w=Math.min(field_w,field_h),field_h=field_w,totw=field_w*w,toth=field_h*h,shift_x=c.shiftX+(c.w-totw)/2,shift_y=c.shiftY+(c.h-toth)/2,field_rw=field_w-field_margin_left,field_rh=field_h-field_margin_top,x=l=0,ref=w;ref>=l;x=l+=1)for(y=m=0,ref1=h;ref1>=m;y=m+=1)c.x.save(),c.x.translate(x*field_w+shift_x,y*field_h+shift_y),rgba=[],rgba=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(0),rgba[3]=1,c.x.fillStyle="rgba("+rgba.join(",")+")",c.x.fillRect(-field_rw,-field_rh,field_rw+1,field_rh+1),c.x.restore();results=[];for(pos in struct)typeName=struct[pos],pos=pos.split("x"),x=parseInt(pos[0])+fieldShiftX,y=parseInt(pos[1])+fieldShiftY,c.x.save(),c.x.translate(x*field_w+shift_x,y*field_h+shift_y),rgba=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateName(typeName)),rgba[3]=1,c.x.fillStyle="rgba("+rgba.join(",")+")",c.x.fillRect(-field_rw,-field_rh,field_rw,field_rh),results.push(c.x.restore());return results},GOLMap.prototype.paint=function(c){var cLineWidthBckp,cStrokeStyleBckp,fact,field_margin_left,field_margin_top,field_rh,field_rw,l,lColor,lTime,m,n,pos,posTxt,ref,ref1,ref2,ref3,ref4,results,rgba,shift_x,shift_y,toth,totw,typeName,x,y,zoom;for(zoom=1.5,field_margin_left=2,field_margin_top=2,this.field_w=c.w*zoom/this.w,this.field_h=c.h*zoom/this.h,this.field_w=Math.min(this.field_w,this.field_h),this.field_h=this.field_w,totw=this.field_w*this.w,toth=this.field_h*this.h,shift_x=c.shiftX+(c.w-totw)/2,shift_y=c.shiftY+(c.h-toth)/2,field_rw=this.field_w-field_margin_left,field_rh=this.field_h-field_margin_top,x=l=0,ref=this.w;ref>=l;x=l+=1)for(y=m=0,ref1=this.h;ref1>=m;y=m+=1)c.x.save(),c.x.translate(x*this.field_w+shift_x,y*this.field_h+shift_y),rgba=[],rgba=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(this.map[x][y]),rgba[3]=1,"persistent"===this.displayMode&&this.metadata[x][y].lastState>0&&(lColor=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(this.metadata[x][y].lastState),lTime=this.simTime-this.metadata[x][y].timeChanged,fact=1/(lTime+10)*7,fact=Math.max(Math.min(fact,1),0),rgba[0]=parseInt((1-fact)*rgba[0]+fact*lColor[0]),rgba[1]=parseInt((1-fact)*rgba[1]+fact*lColor[1]),rgba[2]=parseInt((1-fact)*rgba[2]+fact*lColor[2])),rgba[0]=Math.min(Math.max(0,rgba[0]),255),rgba[1]=Math.min(Math.max(0,rgba[1]),255),rgba[2]=Math.min(Math.max(0,rgba[2]),255),c.x.fillStyle="rgba("+rgba.join(",")+")",c.x.fillRect(-field_rw,-field_rh,field_rw,field_rh),x===this.hoveredFieldX&&y===this.hoveredFieldY&&(cStrokeStyleBckp=c.x.strokeStyle,cLineWidthBckp=c.x.lineWidth,c.x.strokeStyle="white",c.x.lineWidth="4",c.x.rect(-field_rw,-field_rh,field_rw,field_rh),c.x.stroke(),c.x.lineWidth=cLineWidthBckp,c.x.strokeStyle=cStrokeStyleBckp),c.x.restore();if(null!=this.mousePasteStructure){ref2=this.mousePasteStructure;for(posTxt in ref2)typeName=ref2[posTxt],pos=posTxt.split("x"),x=parseInt(pos[0])+this.hoveredFieldX,y=parseInt(pos[1])+this.hoveredFieldY,c.x.save(),c.x.translate(x*this.field_w+shift_x,y*this.field_h+shift_y),rgba=this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.colour(this.lifeObj.lifeTypes[this.lifeObj.type].conditioner.translateStateName(typeName)),rgba[3]=1,c.x.fillStyle="rgba("+rgba.join(",")+")",c.x.fillRect(-field_rw,-field_rh,field_rw,field_rh),c.x.restore()}if(null!=this.selectBox){for(results=[],x=n=ref3=this.selectBox.startX,ref4=this.selectBox.endX;ref4>=n;x=n+=1)results.push(function(){var o,ref5,ref6,results1;for(results1=[],y=o=ref5=this.selectBox.startY,ref6=this.selectBox.endY;ref6>=o;y=o+=1)rgba=[0,255,0,.3],c.x.save(),c.x.translate(x*this.field_w+shift_x,y*this.field_h+shift_y),c.x.fillStyle="rgba("+rgba.join(",")+")",c.x.fillRect(-field_rw,-field_rh,field_rw,field_rh),results1.push(c.x.restore());return results1}.call(this));return results}},GOLMap}(),module.exports=GOLMap;

},{}],6:[function(require,module,exports){
var CanvasHandler,CanvasHandlerPromise,GOLCompiler,GOLMap,PAGE_URL,c,dat,defaultLifeTypes,deserializeState,deserializeStateUrl,gui,life,serializeState,serializeStateUrl;PAGE_URL="http://styczynski.in/gol-designer",dat=require("dat.gui"),gui=null,life={},c=null,CanvasHandlerPromise=require("./CanvasHandlerPromise.coffee"),CanvasHandler=require("./CanvasHandler.coffee"),GOLMap=require("./GOLMap.coffee"),GOLCompiler=require("./GOLCompiler.coffee"),serializeState=function(){var compressedSessions,k,o,ref,v;life.typeSessions[life.type]=life.map.saveSession(),compressedSessions={},ref=life.typeSessions;for(k in ref)v=ref[k],compressedSessions[k]={},compressedSessions[k].ltype=v.ltype,compressedSessions[k].map=v.map;return o=JSON.stringify({typeSessions:compressedSessions,type:life.type,lifeTypes:life.lifeTypes}),LZString.compressToEncodedURIComponent(o)},serializeStateUrl=function(){return PAGE_URL+"?s="+serializeState()},deserializeState=function(o){var code,conditioner,k,ref,v;o=LZString.decompressFromEncodedURIComponent(o),o=JSON.parse(o),life.typeSessions=o.typeSessions,life.type=o.type,life.lifeTypes=o.lifeTypes,ref=life.lifeTypes;for(k in ref)v=ref[k],code=v.code,conditioner=GOLCompiler.compile(code),v.conditioner=conditioner;return life.map.loadSession(life.typeSessions[life.type])},deserializeStateUrl=function(url){var o;return o=url.split("?s=")[1],deserializeState(o)},defaultLifeTypes={Convway:{templates:{Blinker:{"0x0":"Live","0x1":"Live","0x2":"Live"},Toad:{"-1x0":"Live","0x0":"Live","0x1":"Live","1x0":"Live","1x1":"Live","2x1":"Live"},Block:{"0x0":"Live","0x1":"Live","1x0":"Live","1x1":"Live"},Beacon:{"0x0":"Live","0x1":"Live","1x0":"Live","1x1":"Live","2x2":"Live","2x3":"Live","3x2":"Live","3x3":"Live"},Beehive:{"0x1":"Live","1x0":"Live","2x0":"Live","3x1":"Live","1x2":"Live","2x2":"Live"},Boat:{"0x0":"Live","0x1":"Live","1x0":"Live","1x2":"Live","2x1":"Live"},Tub:{"0x1":"Live","1x0":"Live","1x2":"Live","2x1":"Live"},Glider:{"0x2":"Live","1x0":"Live","1x2":"Live","2x1":"Live","2x2":"Live"},LWSS:{"0x0":"Live","0x2":"Live","1x3":"Live","2x3":"Live","3x0":"Live","3x3":"Live","4x1":"Live","4x2":"Live","4x3":"Live"},GospelGun:{"0x4":"Live","0x5":"Live","1x4":"Live","1x5":"Live","10x4":"Live","10x5":"Live","10x6":"Live","11x3":"Live","11x7":"Live","12x2":"Live","12x8":"Live","13x2":"Live","13x8":"Live","14x5":"Live","15x3":"Live","15x7":"Live","16x4":"Live","16x5":"Live","16x6":"Live","17x5":"Live","20x2":"Live","20x3":"Live","20x4":"Live","21x2":"Live","21x3":"Live","21x4":"Live","22x1":"Live","22x5":"Live","24x0":"Live","24x1":"Live","24x5":"Live","24x6":"Live","34x2":"Live","34x3":"Live","35x2":"Live","35x3":"Live"},Pulsar:{"0x2":"Live","0x3":"Live","0x4":"Live","0x8":"Live","0x9":"Live","0x10":"Live","2x0":"Live","2x5":"Live","2x7":"Live","2x12":"Live","3x0":"Live","3x5":"Live","3x7":"Live","3x12":"Live","4x0":"Live","4x5":"Live","4x7":"Live","4x12":"Live","5x2":"Live","5x3":"Live","5x4":"Live","5x8":"Live","5x9":"Live","5x10":"Live","7x2":"Live","7x3":"Live","7x4":"Live","7x8":"Live","7x9":"Live","7x10":"Live","8x0":"Live","8x5":"Live","8x7":"Live","8x12":"Live","9x0":"Live","9x5":"Live","9x7":"Live","9x12":"Live","10x0":"Live","10x5":"Live","10x7":"Live","10x12":"Live","12x2":"Live","12x3":"Live","12x4":"Live","12x8":"Live","12x9":"Live","12x10":"Live"},Pentadecathlon:{"0x2":"Live","0x7":"Live","1x0":"Live","1x1":"Live","1x3":"Live","1x4":"Live","1x5":"Live","1x6":"Live","1x8":"Live","1x9":"Live","2x2":"Live","2x7":"Live"},ExpGrow1:{"0x0":"Live","0x1":"Live","0x4":"Live","1x0":"Live","1x3":"Live","2x0":"Live","2x3":"Live","2x4":"Live","3x2":"Live","4x0":"Live","4x2":"Live","4x3":"Live","4x4":"Live"},ExpGrow2:{"0x5":"Live","2x4":"Live","2x5":"Live","4x1":"Live","4x2":"Live","4x3":"Live","6x0":"Live","6x1":"Live","6x2":"Live","7x1":"Live"},TheRPentomino:{"0x1":"Live","1x0":"Live","1x1":"Live","1x2":"Live","2x0":"Live"},DieHard:{"0x1":"Live","1x1":"Live","1x2":"Live","5x2":"Live","6x0":"Live","6x2":"Live","7x2":"Live"}},code:"set k: countRangeValues(1, Live)\nLive->Dead: k<2 || k>3\nLive->Live: k==2 || k==3\nDead->Live: k==3\nDead"},Highlife:{templates:{Replicator:{"0x2":"Live","0x3":"Live","0x4":"Live","1x1":"Live","1x4":"Live","2x0":"Live","2x4":"Live","3x0":"Live","3x3":"Live","4x0":"Live","4x1":"Live","4x2":"Live"},Bomber:{"0x2":"Live","0x3":"Live","0x4":"Live","1x1":"Live","1x4":"Live","2x0":"Live","2x4":"Live","3x0":"Live","3x3":"Live","4x0":"Live","4x1":"Live","4x2":"Live","5x9":"Live","5x10":"Live","5x11":"Live","12x6":"Live","12x7":"Live","12x8":"Live","13x6":"Live","13x8":"Live","14x6":"Live","14x7":"Live","14x8":"Live"}},code:"set k: countRangeValues(1, Live)\nLive->Dead: k<2 || k>3\nLive->Live: k==2 || k==3\nDead->Live: k==3 || k==6\nDead"},Bubble:{templates:{},code:"Dead: 0\nDead: countRangeValues(3, Live) > 2\nLive: x==0 && y==0\nLive: (x-40)*(x-40) + (y-25)*(y-25) <= (countRangeValues(3, Live)+1)*(countRangeValues(3, Live)+1)\nDead"},ColorExplosion:{templates:{Dot:{"0x0":"V1"},"V3-Block":{"0x0":"V3","1x0":"V3","0x1":"V3","1x1":"V3"}},code:"Live->V1: 1\nV1: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 1\nV2: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 2\nV3: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 3\nV4: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 4\nV5: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 5\nV6: 0\nV7: get(x-1,y) + get(x+1, y) + get(x,y-1) + get(x, y+1) == 6\nV7->V1: 1\nV0"}},module.exports=function(){var boardTools,boardToolsController,codeInput,codeOutput,condNormal,hideSaveLifeDialog,hideSeeUrlDialog,installTemplatesFrameHook,lifeDrawValue,lifeSelectMode,name,props,ref,saveLifeDialogIsShown,saveSelectionAsLife,showSaveLifeDialog,showSeeUrlDialog,templatesFrame,templatesFrameIndex,updateTemplates;codeInput=null,codeOutput=null,templatesFrame=null,templatesFrameIndex=0,lifeSelectMode=!1,life.lifeTypes=defaultLifeTypes,ref=life.lifeTypes;for(name in ref)props=ref[name],life.lifeTypes[name].conditioner=GOLCompiler.compile(props.code);return life.speed=50,life.currentTemplate=null,life.props={},life.displayMode="normal",life.compileGol=function(){},life.setType=function(name){return life.type=name,life.props=life.lifeTypes[life.type]},life.clear=function(){return life.map.clear()},life.serializeState=serializeState,life.deserializeState=deserializeState,life.randomizeBoard=function(){},life.codeInput="",life.simulate=!0,life.type=Object.keys(life.lifeTypes)[0],updateTemplates=function(){},lifeDrawValue="Live",showSeeUrlDialog=function(){var dialog,url;return dialog=$("#seeUrlDialog"),dialog.css("display","block"),dialog.find(".url").text("Generating url..."),url=serializeStateUrl(),dialog.find(".url").text(url)},hideSeeUrlDialog=function(){var dialog;return dialog=$("#seeUrlDialog"),dialog.css("display","none")},saveLifeDialogIsShown=!1,showSaveLifeDialog=function(){var dialog,lifeSaveStatsText;return saveLifeDialogIsShown=!0,dialog=$("#saveLifeDialog"),dialog.css("display","block"),lifeSaveStatsText="Life nodes: "+life.map.countNodesInSelectBox(),$("#saveLifeDialog div.row .stats").text(lifeSaveStatsText)},hideSaveLifeDialog=function(){var dialog;return saveLifeDialogIsShown=!1,dialog=$("#saveLifeDialog"),dialog.css("display","none")},saveSelectionAsLife=function(name){return null==life.lifeTypes[life.type].templates&&(life.lifeTypes[life.type].templates={}),life.lifeTypes[life.type].templates[name]=life.map.getStructFromSelectBox()},boardToolsController={update:function(){}},boardTools={Select:{type:"radio",icon:"fas fa-crop",onActivated:function(){return lifeSelectMode=!0},onDeactivated:function(){return!saveLifeDialogIsShown&&(lifeSelectMode=!1,life.map.setSelectBox(null,null),boardToolsController.update(),c.flush())}},Copy:{type:"button",icon:"fas fa-clone",onClicked:function(){return showSaveLifeDialog()},isEnabled:function(){return null!==life.map.getSelectBox()}},Remove:{type:"radio",icon:"fas fa-times",onActivated:function(){return lifeDrawValue=null},onDeactivated:function(){return lifeDrawValue="Live"}},Save:{type:"button",icon:"far fa-save",onClicked:function(){return showSeeUrlDialog()},isEnabled:function(){return!0}}},installTemplatesFrameHook=function(){return templatesFrame.on("active",function(eventName,eventIndex){var selectedTemplateName,templatesFrameNode,templatesNames;return templatesFrameIndex>eventIndex&&(null!=life.lifeTypes[life.type].templates&&(templatesNames=Object.keys(life.lifeTypes[life.type].templates),selectedTemplateName=templatesNames[eventIndex],life.currentTemplate===selectedTemplateName?(life.currentTemplate=null,templatesFrameNode=$("#templatesFrame"),life.map.setPastedStructure(null),templatesFrame.activate(templatesFrameIndex)):life.currentTemplate=selectedTemplateName,life.map.setPastedStructure(life.lifeTypes[life.type].templates[life.currentTemplate])),!0)})},updateTemplates=function(){var ref1,templateName,templateNode,templatePreviewC,templatePreviewCanvas,templatePreviewCtx,templateProp,templatesContentNode,templatesSlyOptions;if(null!=templatesFrame&&(templatesFrame.destroy(),$("#templatesFrame").sly(!1),templatesFrame=null,templatesFrameIndex=0),templatesContentNode=$("#templatesContent"),templatesContentNode.children().remove(),null!=life.lifeTypes[life.type].templates){ref1=life.lifeTypes[life.type].templates;for(templateName in ref1)templateProp=ref1[templateName],templateNode=$("<li></li>"),templateNode.append($("<div class='templateRowName'>"+templateName+"</div>")),templateNode.append($("<div class='templateRowPreview'><canvas class='templateRowPreviewCanvas"+templateName+"'></canvas></div>")),templatesContentNode.append(templateNode),templatePreviewCanvas=templatesContentNode.find(".templateRowPreviewCanvas"+templateName),templatePreviewCtx=templatePreviewCanvas[0].getContext("2d"),templatePreviewC={x:templatePreviewCtx,dom:templatePreviewCanvas,w:300,h:200,shiftX:0,shiftY:0},templatePreviewCanvas.css("width","69px"),templatePreviewCanvas.css("height","50px"),life.map.paintPreview(templatePreviewC,templateProp),++templatesFrameIndex;templateNode=$('<li class="template-null"></li>'),templateNode.css("opacity","0"),templatesContentNode.append(templateNode)}if(null==templatesFrame)return templatesSlyOptions={horizontal:0,itemNav:"centered",activateOn:"click",mouseDragging:1,touchDragging:1,releaseSwing:1,startAt:0,scrollBy:1,activatePageOn:"click",speed:300,elasticBounds:1,dragHandle:1,dynamicHandle:1,clickBar:1},templatesFrame=new Sly($("#templatesFrame"),templatesSlyOptions),templatesFrame.on("load",function(){return templatesFrame.activate(templatesFrameIndex),installTemplatesFrameHook()}),templatesFrame.init()},window.onload=function(){var displayModeController,eNode,pNode,updateLifeNode;return $(document).ready(function(){var lname,lnode,lprop,ref1,slyContent,slyFrame,slyOptions;hideSaveLifeDialog(),hideSeeUrlDialog(),$("#saveLifeDialog div.btn.save").click(function(){return saveSelectionAsLife($("div.row.lifeName input").val()),hideSaveLifeDialog(),lifeSelectMode=!1,life.map.setSelectBox(null,null),boardToolsController.update(),c.flush(),updateTemplates()}),$("div.btn.ok").click(function(){return hideSeeUrlDialog()}),$("div.btn.cancel").click(function(){return hideSaveLifeDialog()}),slyOptions={horizontal:1,itemNav:"forceCentered",activateOn:"click",mouseDragging:1,touchDragging:1,releaseSwing:1,startAt:0,scrollBy:1,activatePageOn:"click",speed:300,elasticBounds:1,dragHandle:1,dynamicHandle:1,clickBar:1},slyContent=$("#slyContent"),ref1=life.lifeTypes;for(lname in ref1)lprop=ref1[lname],lnode=$("<li><div class='text'>"+lname+"</div></li>"),slyContent.append(lnode);return slyFrame=new Sly($("#slyFrame"),slyOptions),slyFrame.on("load",function(){var curIndex,fn,ref2,results;curIndex=0,ref2=life.lifeTypes,fn=function(name,prop,index){return slyFrame.on("active",function(eventName,eventIndex){if(index===eventIndex)return life.setType(name)})},results=[];for(lname in ref2)lprop=ref2[lname],fn(lname,lprop,curIndex),results.push(++curIndex);return results}),slyFrame.init(),life.setType(Object.keys(life.lifeTypes)[0]),updateTemplates()}),gui=new dat.GUI,gui.add(life,"type"),gui.add(life,"clear"),gui.add(life,"randomizeBoard"),gui.add(life,"codeInput"),displayModeController=gui.add(life,"displayMode",["normal","persistent"]),displayModeController.listen(),updateLifeNode=function(){var lifeTypeDescNode,lifeTypeNameNode,lifeTypeNode,lifeTypeNodeContent;return lifeTypeNodeContent=$(gui.__controllers[0].domElement),lifeTypeNode=lifeTypeNodeContent.parent(),lifeTypeNodeContent.css("display","none"),lifeTypeNode.parent().css("height","87px"),lifeTypeNode.append("<div id='life-type-display'>\n  <b id='life-type-name'></b>\n  <br>\n  <div id=''></div>\n  <p id='life-type-description'>\n    No details provided.\n  </p>\n</div>"),lifeTypeNameNode=lifeTypeNode.find("#life-type-name"),lifeTypeNameNode.text(life.type),lifeTypeDescNode=lifeTypeNode.find("#life-type-description"),lifeTypeDescNode.text(life.props.description||"No description provided.")},displayModeController.onChange(function(value){return life.map.setDisplayMode(value)}),updateLifeNode(),life.typeSessions={},life.setType=function(name){return life.typeSessions[life.type]=life.map.saveSession(),life.type=name,life.props=life.lifeTypes[life.type],life.codeInput=life.props.code||"",null!=codeInput&&codeInput.update(life.codeInput),updateLifeNode(),updateTemplates(),null!=life.typeSessions[name]?life.map.loadSession(life.typeSessions[name]):(life.map.reset(),life.typeSessions[life.type]=life.map.saveSession()),c.flush()},eNode=$(gui.__controllers[3].domElement),pNode=eNode.parent(),eNode.css("display","none"),pNode.parent().css("height","350px"),pNode.append('<div id="datgui-code-input"></div>'),codeInput=new CodeFlask,codeInput.run("#datgui-code-input",{language:"javascript"}),codeInput.update(""),gui.add(life,"simulate"),gui.add(life,"speed",0,100),$(document).ready(function(){return setTimeout(function(){var compileCode,el,fn,tim,toolBoxNode,toolName,toolProps;boardToolsController.update=function(){var isButtonEnabled,k,results,v;results=[];for(k in boardTools)v=boardTools[k],"button"===v.type?(v.enabled=null==v.isEnabled||v.isEnabled(),isButtonEnabled=!0,null!=v.enabled&&(isButtonEnabled=v.enabled),isButtonEnabled?(toolBoxNode.find("div.tool."+k).removeClass("disabled"),results.push(toolBoxNode.find("div.tool."+k).addClass("enabled"))):(toolBoxNode.find("div.tool."+k).removeClass("enabled"),results.push(toolBoxNode.find("div.tool."+k).addClass("disabled")))):results.push(void 0);return results},toolBoxNode=$("#toolbox"),fn=function(name,props){var toolNode;return toolNode=$("<div class='tool "+name+"'><i class='"+props.icon+"'></i></div>"),toolNode.click(function(){var isActiveNow,isButtonEnabled,k,results,v;isActiveNow=$(this).hasClass("active"),boardToolsController.update(),isActiveNow?("button"!==props.type&&props.onDeactivated(),toolBoxNode.find(".active").removeClass("active")):"button"===props.type?(isButtonEnabled=!0,null!=props.enabled&&(isButtonEnabled=props.enabled),isButtonEnabled&&(props.onClicked(),toolBoxNode.find(".active").removeClass("active"))):(props.onActivated(),toolBoxNode.find(".active").removeClass("active"),$(this).addClass("active")),results=[];for(k in boardTools)v=boardTools[k],results.push(k!==name?"radio"===v.type?v.onDeactivated():void 0:void 0);return results}),toolBoxNode.append(toolNode)};for(toolName in boardTools)toolProps=boardTools[toolName],fn(toolName,toolProps);return boardToolsController.update(),el=$("#datgui-code-input"),el.css("width","100%"),el.css("height","350px"),el.css("background","white"),tim=-1,compileCode=function(){var code,conditioner;return code=el.text(),conditioner=life.compileGol(code),life.lifeTypes[life.type].code=code,life.lifeTypes[life.type].conditioner=conditioner},el.on("keydown keyup changed",function(){return clearTimeout(tim),tim=setTimeout(function(){return compileCode()},250)}),compileCode(),setTimeout(function(){return"undefined"!=typeof window&&null!==window&&null!=window.location&&null!=window.location.href&&window.location.href.indexOf("?s=")!==-1&&deserializeStateUrl(window.location.href),life.stepAuto()},500)},500)})},condNormal=GOLCompiler.compile("set k: countRangeValues(1, Live)\nLive->Dead: k<2\nLive->Dead: k>3\nLive->Live: k == 2 || k == 3\nDead->Live: k == 3\nDead"),life.map=new GOLMap(80,50,life),$(document).ready(function(){return life.map.onFieldHover(function(x,y,xAbs,yAbs,props){var descFrameColNode,descFrameModifTimeNode,descFrameNode,descFramePosNode,descFrameStateNode,descPrevTypeNode,templateStr;return templateStr="<b>Cell <i>"+x+" x "+y+"</i></b>\n<br>\n<b>Type:</b> <i>"+props.stateName+"</i><br>\n",descFrameNode=$("#propDisplay"),descFrameColNode=descFrameNode.find(".col .box"),descFrameStateNode=descFrameNode.find(".state"),descFramePosNode=descFrameNode.find(".position"),descFrameModifTimeNode=descFrameNode.find(".modifTime"),descPrevTypeNode=descFrameNode.find(".prevType"),descFrameStateNode.text(""+props.stateName),descFramePosNode.text(x+" x "+y),descFrameColNode.css("background","rgb("+props.color[0]+","+props.color[1]+","+props.color[2]+")"),descFrameModifTimeNode.text(props.timeCurrent-props.timeChanged+" tick/-s ago"),descPrevTypeNode.text(""+props.lastStateName)})}),c=new CanvasHandler({id:"#golcanvas",w:function(){return $(window).width()},h:function(){return $(window).height()},onDrag:function(x,y,c,coords){var posA,posB;return lifeSelectMode?(posA=life.map.canvasXYToBoardXY(coords.startX,coords.startY,c),posB=life.map.canvasXYToBoardXY(coords.endX,coords.endY,c),life.map.setSelectBox(posA,posB),boardToolsController.update()):(life.map.setSelectBox(null,null),boardToolsController.update(),c.moveBy(80*x,50*y)),c.flush()},onMove:function(x,y,c){return life.map.onMouseMove(x,y,c)},onClick:function(x,y,c){var drawStruct,mapCoords,templatesFrameNode;return mapCoords=life.map.canvasXYToBoardXY(x,y,c),drawStruct=!1,null!=life.currentTemplate&&null!=life.lifeTypes[life.type].templates&&(drawStruct=!0),drawStruct?(life.map.drawStructure(mapCoords[0],mapCoords[1],life.lifeTypes[life.type].templates[life.currentTemplate]),life.currentTemplate=null,life.currentTemplate=null,templatesFrameNode=$("#templatesFrame"),life.map.setPastedStructure(null),templatesFrame.activate(templatesFrameIndex)):null==lifeDrawValue?life.map.setValue(mapCoords[0],mapCoords[1],0):life.map.set(mapCoords[0],mapCoords[1],lifeDrawValue)}}).ready(),life.randomizeBoardEx=function(strength){return life.map.randomizeABit(strength,"Live")},life.randomizeBoard=function(){return life.randomizeBoardEx(10)},life.step=function(){var s;return life.simulate?(s=0,life.map.step(s,s),c.flush(),1):0},life.stepAuto=function(){return life.step(),setTimeout(function(){return life.stepAuto()},10*(100-life.speed))},c.on(window,"resize").paint(function(c){return c.x.fillStyle="rgba(0, 45, 66, 0.1)",c.x.fillRect(0,0,c.w,c.height)}).paint(life.map),window.life=life,life.compileGol=function(code){return null!=codeOutput&&codeOutput.update(code),life.lifeTypes[life.type].conditioner=GOLCompiler.compile(code)}}();

},{"./CanvasHandler.coffee":2,"./CanvasHandlerPromise.coffee":3,"./GOLCompiler.coffee":4,"./GOLMap.coffee":5,"dat.gui":1}],7:[function(require,module,exports){
!function(){return require("./gol.coffee")}();

},{"./gol.coffee":6}]},{},[7]);
