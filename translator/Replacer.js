var Replacer = function(fromRegex, toText) {
  this.fromRegex = fromRegex;
  this.toText = toText;
};

Replacer.prototype.replaceIn = function(text) {
  if (typeof text !== 'string') {
    throw Error('text to be replaced needs to be string');
  }

  return text.replace(this.fromRegex, this.toText);
};

module.exports = Replacer;
