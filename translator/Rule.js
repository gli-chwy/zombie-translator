var Replacer = require('./Replacer');

var Rule = function(description, zombifyReplacer, unzombifyReplacer) {
  this.description = description;

  if (!zombifyReplacer || zombifyReplacer.constructor != Replacer) {
    throw Error("zombifyReplacer needs to be a Replacer function");
  }

  if (!unzombifyReplacer || unzombifyReplacer.constructor != Replacer) {
    throw Error("unzombifyReplacer needs to be a Replacer function");
  }

  this.zombifyReplacer = zombifyReplacer;
  this.unzombifyReplacer = unzombifyReplacer;
};


Rule.prototype.zombify = function(text) {
  return this.zombifyReplacer.replaceIn(text);
};

Rule.prototype.unzombify = function(text) {
  return this.unzombifyReplacer.replaceIn(text);
};

module.exports = Rule;
