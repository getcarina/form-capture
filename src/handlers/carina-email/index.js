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
    console.log('running handler carinaEmail: ' + req.body.email);

    var message = {
      from: '<noreply@getcarina.com>',
      to: process.env.CARINA_EMAIL_RECIPIENT,
      'h:Reply-To': req.body.email,
      subject: util.format('Interested in Carina Workshop: %s', req.body.name),
      text: nunjucks.render(path.resolve(__dirname, 'templates/carina-workshop-signup.txt'), {data: req.body})
    };

    mailgun.messages().send(message)
    .then(function () {
      res.status(202);
      res.end();
      return next();
    })
    .catch(function (err) {
      console.log('Error sending email message');
      console.log(err);
      return next(err);
    });
  }
};
