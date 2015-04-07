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

/**
 * Creates an element closure which pushes/pops the child work stack when
 * elements have children.
 *
 * @param el {tag|React.Component} The React element type.
 */
function createElementFn(el) {
  return function(props, children) {
    if (typeof props === 'function' || typeof props == 'string' || props instanceof String) {
      children = props;
      props = null;
    }

    if (typeof children === 'function') {
      this._stack.push();
      children(this);
      children = this._stack.pop();
    }

    if (props) {
      if (props.class) {
        props.className = props.class;
        delete props.class;
      }
      if (props.for) {
        props.htmlFor = props.for;
        delete props.for;
      }
    }

    var args = [].concat(el, props, children);
    // if (props) args.push(props)
    // if (children) args.push(children)

    //console.log('createElement', el, props, children);
    this._stack.append(React.createElement.apply(React, args));
    return this._stack.data();
  };
}


/**
 * Function based JSX.
 */
function Fsx(components) {
  this._stack = new Stack();
  this.register(components);
}

var root = Fsx.prototype;

root.append = function(v) {
  var stack = this._stack;
  if (Array.isArray(v)) {
    for (var i = 0; i < v.length; i++) {
      stack.append(v[i]);
    }
  } else {
    this._stack.append(v);
  }
};

root.register = function(components) {
  var self = this;
  if (components) {
    for (var key in components) {
      var fn = createElementFn(components[key]);
      self[key] = fn;
    }
  }
};

/**
 * Renders the children function.
 */
root.fsx = function(inner) {
  this._stack.reset();
  inner(this);
  var result = this._stack.data();
  console.log('fsx result', result);
  return result;
};

/**
 * Renders a custom React.Compoment.
 */
root.$ = function(component, props, children) {
  var fn = createElementFn(component).bind(this);
  return fn(props, children);
};

/**
 * Adds text markup.
 */
root.text = function(str) {
  this._stack.append(str);
};

/**
 * Attach element methods for each tag.
 */
tags.forEach(function(tag) {
  Fsx.prototype[tag] = createElementFn(tag);
});

/**
 * fsx creates an instance of Fsx and renders the children function.
 *
 * @param children {Function} The function to render.
 */
exports.fsx = function fsx(components, inner) {
  if (!inner) {
    inner = components;
    components = null;
  }
  var f = new Fsx(components);
  return f.fsx(inner);
};


function isString(v) {
  return typeof v === 'string' || v instanceof String;
}

exports.createContext = function() {
  var tags = [].slice.call(arguments);
  function FSX() {
    this._stack = new Stack;
    var self = this;
    tags.forEach(function(tag) {
      if (isString(tag)) {
        self[tag] = self[tag].bind(self);
        return;
      }

      // Assign components {MyComponent: MyComponent}
      for (var key in tag) {
        if (tag.hasOwnProperty(key)) {
          self[key] = self[key].bind(self);
        }
      }
    });

    return this;
  }

  tags.forEach(function(tag) {
    if (isString(tag)) {
      var fn = root[tag];
      if (!fn) throw new Error(tag + 'is not an element function');
      FSX.prototype[tag] = fn;
      return;
    }

    // Assign components {MyComponent: MyComponent}
    for (var key in tag) {
      if (tag.hasOwnProperty(key)) {
        FSX.prototype[key] = createElementFn(tag[key]);
      }
    }
  });

  return new FSX;
};


