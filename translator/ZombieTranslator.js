var Rule = require('./Rule');

var ZombieTranslator = function() {
  this.rules = [];
};

ZombieTranslator.prototype.addRule = function(rule) {
  this.rules.push(rule);
};

ZombieTranslator.prototype.zombifyChainingRules = function(text) {
  var result = text;
  var ruleCount = this.rules.length;
  for (var i=0; i<ruleCount; i++) {
    var rule = this.rules[i];
    result = rule.zombify(result);
  }
  return result;
};

ZombieTranslator.prototype.processWithoutOverlappingRules = function(replacer, text) {
  function replaceSegment(remainingRules, resultToBeMatched) {
    var currentRule = remainingRules.shift();

    if (currentRule === undefined) {
      //console.log("no rule left, returning " + resultToBeMatched);
      return resultToBeMatched;
    }

    var lastMatchIndex;
    var lastMatchLength;

    var replacementText = '';
    resultToBeMatched.replace(currentRule[replacer].fromRegex, function() {
      var currentMatchLength = arguments[0].length;
      var currentMatchIndex = arguments[arguments.length-2];//next to the last arg is the index

      //unmatched part before the match
      var unmatchedIndex = 0;
      if (lastMatchLength) {
        unmatchedIndex = lastMatchIndex + lastMatchLength;
      }

      var unmatchedBefore = resultToBeMatched.substring(unmatchedIndex, currentMatchIndex);
      replacementText = replacementText + replaceSegment(remainingRules.slice(), unmatchedBefore);

      if (typeof currentRule[replacer].toText === 'function') {
        replacementText = replacementText + currentRule[replacer].toText.apply(null, arguments);
      } else {
        replacementText = replacementText + currentRule[replacer].toText;
      }

      lastMatchLength = currentMatchLength;
      lastMatchIndex = currentMatchIndex;

    });

    //last unmatch
    var unmatchedAfter = resultToBeMatched.substring(lastMatchIndex + lastMatchLength);
    replacementText = replacementText + replaceSegment(remainingRules.slice(), unmatchedAfter);

    return replacementText;
  };

  return replaceSegment(this.rules.slice(), text);
};

ZombieTranslator.prototype.zombifyWithoutOverlappingRules = function(text) {
  function replaceSegment(remainingRules, resultToBeMatched) {
    var currentRule = remainingRules.shift();

    if (currentRule === undefined) {
      //console.log("no rule left, returning " + resultToBeMatched);
      return resultToBeMatched;
    }

    var lastMatchIndex;
    var lastMatchLength;

    var replacementText = '';
    resultToBeMatched.replace(currentRule.zombifyReplacer.fromRegex, function() {
      var currentMatchLength = arguments[0].length;
      var currentMatchIndex = arguments[arguments.length-2];//next to the last arg is the index

      //unmatched part before the match
      var unmatchedIndex = 0;
      if (lastMatchLength) {
        unmatchedIndex = lastMatchIndex + lastMatchLength;
      }

      var unmatchedBefore = resultToBeMatched.substring(unmatchedIndex, currentMatchIndex);
      replacementText = replacementText + replaceSegment(remainingRules.slice(), unmatchedBefore);

      if (typeof currentRule.zombifyReplacer.toText === 'function') {
        replacementText = replacementText + currentRule.zombifyReplacer.toText.apply(null, arguments);
      } else {
        replacementText = replacementText + currentRule.zombifyReplacer.toText;
      }

      lastMatchLength = currentMatchLength;
      lastMatchIndex = currentMatchIndex;

    });

    //last unmatch
    var unmatchedAfter = resultToBeMatched.substring(lastMatchIndex + lastMatchLength);
    replacementText = replacementText + replaceSegment(remainingRules.slice(), unmatchedAfter);

    return replacementText;
  };

  return replaceSegment(this.rules.slice(), text);
};

Function.prototype.curry = function() {
  var fn = this,
  args = Array.prototype.slice.call(arguments);
  return function() {
    return fn.apply(this, args.concat(
      Array.prototype.slice.call(arguments)));
    };
  };

  ZombieTranslator.prototype.zombify = ZombieTranslator.prototype.processWithoutOverlappingRules.curry('zombifyReplacer');

  ZombieTranslator.prototype.unzombify = ZombieTranslator.prototype.processWithoutOverlappingRules.curry('unzombifyReplacer');

  module.exports = ZombieTranslator;
