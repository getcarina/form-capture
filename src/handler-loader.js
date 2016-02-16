// We could scan the directory and require all these dynamically.
// Right now there's only one so it doesn't really matter.
var handlers = [];
handlers.push(require('./handlers/carina-email'));

module.exports = function (req, res, next) {
  'use strict';
  var handlerToRun;

  var badRequest = function (e) {
    e = e || null;
    console.log('Rejecting bad request');
    console.log(e);
    res.status(400);
    res.end();
    return next(e);
  };

  if (!req.body || !req.body.handlerId) {
    return badRequest();
  }

  // Find a handler with the provided handlerId
  handlers.forEach((handler) => {
    if (req.body.handlerId === handler.id) {
      handlerToRun = handler.handler;
    }
  });

  if (!handlerToRun) {
    return badRequest();
  }

  return handlerToRun.apply(null, arguments);
};
