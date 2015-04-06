'use strict';

function Stack() {
  this.reset();
}

Stack.prototype.reset = function() {
  this.stack = [[]];
  this.current = [];
};

Stack.prototype.push = function() {
  this.stack.push(this.current);
  this.current = [];
};

Stack.prototype.append = function(component) {
  this.current.push(component);
};

Stack.prototype.pop = function() {
  var popped = this.current;
  this.current = this.stack.pop();
  return popped;
};

Stack.prototype.data = function() {
  return this.current.length === 1 ? this.current[0] : this.current;
};

module.exports = Stack;
