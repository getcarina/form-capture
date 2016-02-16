// We could scan the directory and require all these dynamically.
// Right now there's only one so it doesn't really matter.
var handlers = [];
handlers.push(require('./handlers/carina-email'));

module.exports = function (req, res, next) {
  'use strict';
  var body, handlerToRun;

  var badRequest = function (e) {
    e = e || null;
    res.status(400);
    res.end();
    return next(e);
  };

  // Make sure the request is even JSON
  try {
    body = JSON.parse(req.body);
  } catch (e) {
    return badRequest(e);
  }

  if (!body || !body.handlerId) {
    return badRequest();
  }

  // Find a handler with the provided handlerId
  handlers.forEach((handler) => {
    if (body.handlerId === handler.id) {
      handlerToRun = handler.handler;
    }
  });

  if (!handlerToRun) {
    return badRequest();
  }

  return handlerToRun.apply(null, arguments);
};
