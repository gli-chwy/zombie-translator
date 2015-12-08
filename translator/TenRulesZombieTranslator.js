var Replacer = require('./Replacer');
var Rule = require('./Rule');
var ZombieTranslator = require('./ZombieTranslator');

var TenRulesZombieTranslator = function() {
	this.translator = new ZombieTranslator();

	// 1. lower-case "r" at the end of words replaced with "rh".
	this.translator.addRule(
	    new Rule('rule #1, lower-case "r" at the end of words replaced with "rh"',
		     new Replacer(/r\b/g, 'rh'), new Replacer(/rh\b/g, 'r')));

	// 2. an "a" or "A" by itself will be replaced with "hra". <== original
	// 2. an "a" or "A" is replaced with "hra" <== edited requirement
	this.translator.addRule(
	    new Rule('rule #2, an "a" or "A" is replaced with "hra"',
		     new Replacer(/a/ig, 'hra'), new Replacer(/hra/g, 'a')));

	// 3. the starts of sentences are capitalised (the "start of a sentence" is any occurrence of
	//   ".!?", followed by a space, followed by a letter.)
	this.translator.addRule(
	    new Rule('rule #3, the starts of sentences are capitalised',
		     new Replacer(/([.!?] )([a-z])/g, function(match, punc, word) {
			 return punc + word.toUpperCase()}),
		     new Replacer(/([.!?] )([A-Z])/g, function(match, punc, word) {
			 return punc + word.toLowerCase()})));

	// 4. "e" or "E" is replaced by "rr"
	this.translator.addRule(
	    new Rule('rule #4, "e" or "E" is replaced by "rr"',
		     new Replacer(/e/ig, 'rr'), new Replacer(/rr/g, 'e')));

	// 5. "i" or "I" is replaced by "rrRr"
	this.translator.addRule(
	    new Rule('rule #5, "i" or "I" is replaced by "rrRr"',
		     new Replacer(/i/ig, 'rrRr'), new Replacer(/rrRr/g, 'i')));

	// 6. "o" or "O" is replaced by "rrrRr"
	this.translator.addRule(
	    new Rule('rule #6, "o" or "O" is replaced by "rrrRr"',
		     new Replacer(/o/ig, 'rrrRr'), new Replacer(/rrrRr/g, 'o')));

	// 7. "u" or "U" is replaced by "rrrrRr"
	this.translator.addRule(
	    new Rule('rule #7, "u" or "U" is replaced by "rrrrRr"',
		     new Replacer(/u/ig, 'rrrrRr'), new Replacer(/rrrrRr/g, 'u')));

	// 8. "r" or "R' is replaced by "RR"
	this.translator.addRule(
	    new Rule('rule #8, "r" or "R" is replaced by "RR"',
		     new Replacer(/r/ig, 'RR'), new Replacer(/RR/g, 'r')));

	// 9. "1" is replaced by "2"
	this.translator.addRule(
	    new Rule('rule #9, "1" is replaced by "2"',
		     new Replacer(/1/g, '2'), new Replacer(/2/g, '1')));

	// 10. "2" is replaced by "1"
	this.translator.addRule(
	    new Rule('rule #10, "2" is replaced by "1"',
		     new Replacer(/2/g, '1'), new Replacer(/1/g, '2')));

    };

TenRulesZombieTranslator.prototype.zombify = function(text) {
   return this.translator.zombify(text);
};

TenRulesZombieTranslator.prototype.unzombify = function(text) {
   return this.translator.unzombify(text);
};

module.exports = TenRulesZombieTranslator;
