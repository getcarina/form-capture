var restify = require('restify');
var handlerLoader = require('./src/handler-loader');

var server = restify.createServer();
server.use(restify.CORS());

server.post('/collect', restify.bodyParser(), handlerLoader);

server.listen(process.env.NODE_PORT || 8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
