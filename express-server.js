var maxInputLength = 1000;

var http = require('http');
var fs = require('fs');
var express = require('express');
var morgan = require('morgan')

var markdownTrans = require('./markdownTransformer');
var TenRulesZombieTranslator = require('./translator/TenRulesZombieTranslator');
var translator = new TenRulesZombieTranslator();


var app = express();

app.use(morgan('combined'));

app.get('/', function(req, response) {
  response.writeHead(200, {'Content-Type': 'text/html'});
  var file = fs.createReadStream('README.md');

  file.pipe(markdownTrans()).pipe(response);

  file.on("finished", function(){
    response.end();
  });
});

app.get(/(un)?zombify/, function(request, response) {
  var action = request.path.substring(1);

  var inputText = request.query.input || '';
  console.log(action + ' input is [' + inputText + ']');

  if (inputText.length > maxInputLength) {
    errorResponse(response, 414, 'Maximum input length allowed is ' + maxInputLength);
    return;
  }

  try {
    var outputText;
    if ('zombify' === action) {
      outputText = translator.zombify(inputText);
    } else if ('unzombify' === action) {
      outputText = translator.unzombify(inputText);
    } else {
      //NOTE will not happen as invalid routes won't come here
    }
    console.log(action + ' output is [' + outputText + ']');

    response.json({'output': outputText});

  } catch (er) {
    console.log('error ' + action + ' text ' + inputText);
    console.log(er.stack);

    errorResponse(response, 500, 'Internal Server Error');
  }

});

app.use(function(req, res) {
  errorResponse(res, 404, 'route ' + req.url + ' not found');
});

function errorResponse(response, code, message) {
  response
    .status(code)
    .json(
      {
        status: code,
        'message': message
      }
    );
}

var server = app.listen(7000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
