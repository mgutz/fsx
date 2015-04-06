'use strict';

var React = require('react');
var Stack = require('./stack');

// https://facebook.github.io/react/docs/tags-and-attributes.html
var tags = [
  // HTML
  'a', 'bbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br',
  'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn',
  'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5',
  'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link',
  'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option',
  'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
  'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th',
  'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr',

  // SVG
  'circle', 'defs', 'ellipse', 'g', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline',
  'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'
];

var createElement, elementFn;


/**
 * Function based JSX.
 */
function Fsx() {
  this._stack = new Stack();
}

var root = Fsx.prototype;

root._boundedElement = function(tagOrComponent) {
  if (this[tagOrComponent]) return this[tagOrComponent].bind(this);
  return this.$.bind(this, tagOrComponent);
};

/**
 * Renders the component.
 */
root.fsx = function(inner) {
  this._stack.reset();
  inner(this);
  return this._stack.data();
};

/**
 * Get bound elements.
 */
root.getBound = function() {
  // console.log("getBound.0 arguments", arguments);
  var self = this;
  if (arguments.length === 1) {
    return self._boundedElement(arguments[0]);
  }
  var args = [].slice.call(arguments);
  // console.log("getBound.1 arguments", args);
  var result = args.map(function(arg) {
    return self._boundedElement(arg);
  });
  // console.log("getbound.2", result);
  return result;
};

/**
 * Use to render child components.
 */
root.$ = function(component, props, inner) {
  var el = React.createFactory(component);
  var fn = elementFn(el).bind(this);
  fn(props, inner);
};

/**
 * Adds text markup.
 */
root.text = function(str) {
  this._stack.append(str);
};

elementFn = function(el) {
  return function(props, inner) {
    var l = arguments.length;
    if (l === 0) {
      return this._stack.append(el());
    }
    if (l === 1 && (typeof props === 'function' || typeof props == 'string' || props instanceof String)) {
      inner = props;
      props = null;
    }

    if (typeof inner === 'function') {
      this._stack.push();
      inner(this);
      inner = this._stack.pop();
    }

    this._stack.append(el.apply(el, [].concat(props, inner)));
    return this._stack.data();
  };
};

createElement = function(root, tag) {
  var el = React.createFactory(tag);
  root[tag] = elementFn(el);
};

for (var i = 0; i < tags.length; i++) {
  createElement(Fsx.prototype, tags[i]);
}

/**
 * The main Fsx class.
 */
exports.Fsx = Fsx;

/**
 * fsx creates an instance of Fsx and renders the inner function.
 *
 * @param inner {Function} The function to render.
 */
exports.fsx = function fsx(inner) {
  var f = new Fsx();
  return f.fsx(inner);
};

