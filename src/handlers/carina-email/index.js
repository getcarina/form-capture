var util = require('util');
var path = require('path');

var mailgun = require('mailgun-js')({
  domain: process.env.MAILGUN_DOMAIN,
  apiKey: process.env.MAILGUN_APIKEY
});
var nunjucks = require('nunjucks');

module.exports = {
  id: 'carinaEmail',
  handler: function (req, res, next) {
    'use strict';
    var body;

    // The handler loader should have caught this, so let's be less forgiving
    // about the error if it's there.
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      return next(e);
    }

    var message = {
      from: '<noreply@getcarina.com>',
      to: process.env.CARINA_EMAIL_RECIPIENT,
      'h:Reply-To': body.email,
      subject: util.format('Interested in Carina Workshop: %s', body.name),
      text: nunjucks.render(path.resolve(__dirname, 'templates/carina-workshop-signup.txt'), {data: body})
    };

    mailgun.messages().send(message)
    .then(function () {
      res.status(202);
      res.end();
      return next();
    })
    .catch(function (err) {
      return next(err);
    });
  }
};
