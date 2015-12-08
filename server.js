var http = require('http');
var fs = require('fs');
var url = require('url');
var logger = require('./logger');
var markdownTrans = require('./markdownTransformer');

var TenRulesZombieTranslator = require('./translator/TenRulesZombieTranslator');

var translator = new TenRulesZombieTranslator();
var maxInputLength = 1000;

var handleRequest = function(request, response) {

  var purl = url.parse(request.url, true);

  if (request.url === '/') {
    response.writeHead(200, {'Content-Type': 'text/html'});
    var file = fs.createReadStream('README.md');

    file.pipe(markdownTrans()).pipe(response);

    file.on("finished", function(){
      response.end();
    });

  } else if(request.url === '/favicon.ico'){
    response.writeHead(200);
    response.end();
    return;

  } else if(purl.pathname === '/zombify'){
    handleTranslation('zombify');

  } else if(purl.pathname === '/unzombify'){
    handleTranslation('unzombify');

  } else {
    errorResponse(404, 'route ' + request.url + ' not found');
  }

  logger(request, response);

  function handleTranslation(action) {
    response.writeHead(200, {'Content-Type': 'application/json'});

    var inputText = purl.query.input || '';
    console.log(action + ' input is [' + inputText + ']');

    if (inputText.length > maxInputLength) {
      errorResponse(414, 'Maximum input length allowed is ' + maxInputLength);
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

      response.end(JSON.stringify({'output': outputText}));

    } catch (er) {
      console.log('error ' + action + ' text ' + inputText);
      console.log(er.stack);

      errorResponse(500, 'Internal Server Error');
    }
  }

  function errorResponse(code, message) {
    response.writeHead(code);
    response.end(JSON.stringify(
      {
        status: code,
        'message': message
      }
    ));
  }
}

var server = http.createServer(handleRequest);
var port = 7000;

server.listen(port, function(){
  console.log("Listening on port " + port);
});
