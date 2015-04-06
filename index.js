'use strict';

var React = require('react');

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
    this.scope = [];
}

var root = Fsx.prototype;

/**
 * Use render child components.
 */
root.$ = function(component, props, inner) {
    var el = React.createFactory(component);
    var fn = elementFn(el).bind(this);
    return fn(props, inner);
};

/**
 * Adds text markup.
 */
root.text = function(str) {
  return this.scope.push(str);
};

var i, tag;
for (i = 0; i < tags.length; i++) {
    if (!tags.hasOwnProperty(i)) continue;
    tag = tags[i];
    createElement(Fsx.prototype, tag);
}

elementFn = function(el) {
    return function(props, inner) {
        var l = arguments.length;
        if (l === 0) {
            return this.scope.push(el());
        }
        if (l === 1 && (typeof props === 'function' || typeof props == 'string' || props instanceof String)) {
            inner = props;
            props = null;
        }

        if (typeof inner === 'function') {
            var j = new Fsx();
            inner(j);
            inner = j.scope;
        }

        this.scope.push(el.apply(el, [].concat(props, inner)));
    };
};

createElement = function(root, tag) {
    var el = React.createFactory(tag);
    root[tag] = elementFn(el);
};


module.exports = function fsx(inner) {
    var j = new Fsx();
    inner(j);
    return j.scope.length === 1 ? j.scope[0] : j.scope;
};

