var User = require('../models/user');

exports.getUserData = function(req, res, next) {
    User.findOne({ _id: req.params.id }, function(err, user) {
      if (err) return next(err);
      if (user) {
        res.send(user);
      } else {
        res.redirect('/');
      }
    })
}

exports.updateV1Details = function(req, res, next) {
  User.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      dob: req.body.dob,
      userType: req.body.userType,
      verification: 2,
    }, {new: true}, function(err, user) {
    if (err) throw err;
    if (user) {
      res.send(user);
    }
    // console.log("the update user is now = ", user);
  })
}

exports.updateCreditCard = function(req, res, next) {
  console.log("~~~~~~~~~~~~~~~~~~~~~~", req);
  const ccN = req.body.ccN;

  User.findByIdAndUpdate(req.params.id, {
    ccNumber: ccN,
    ccExpiration: req.body.ccE,
    ccCVV: req.body.ccV,
    ccName: req.body.ccName,
    verification: 3
  }, {new: true}, function(err, user) {
    if (err) throw err;
    if (user) {
      res.send(user);
    }
  })
}
