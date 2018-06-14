var moment = require('moment-timezone');
var _ = require('lodash');

var UserModel = require('../models/user.js');
var Team = require('../models/team.js');
var TeamMember = require('../models/teamMember.js');
var transform = require('../../app/utils/transform.js');
var strings = require('../../app/utils/strings.js');
var getProfileUrl = require('../../app/helpers/urls').getProfileUrl;

var people = module.exports = {};

people.index = function(req, res, next) {
  var usernameOrId = req.params.usernameOrId;

  if (!usernameOrId) return next('User not found :(');

  // NOTE - if this is for the user's own profile, we can skip this query
  UserModel
    .findOneByUsernameOrId(usernameOrId)
    .then(function(user) {
      if (!user) return next('User not found :(');

      // If same user + no name, redirect to onboarding. see comment above
      var isOwner = !!req.user && req.user._id.toString() === user._id.toString();
      if (isOwner && !user.name) {
        return res.redirect('/get-started');
      }

      var isTeamMemberQuery = function() {
        if (isOwner || !req.user)
          return Promise.resolve(false);
        return TeamMember
          .find({ user: { $in: [ req.user._id, user._id ] } })
          .then(function(teamMembers) {
            var groups = _.groupBy(teamMembers, (tm) => tm.user);
            var groupReqUser = groups[req.user._id.toString()].map((tm) => tm.team.toString());
            var groupProfileUser = groups[user._id.toString()].map((tm) => tm.team.toString());
            var intersection = _.intersection(groupReqUser, groupProfileUser);
            return !!intersection.length;
          });
      };

      Promise
        .all([
          isTeamMemberQuery(),
          Team.findAllByUser(user)
        ])
        .then(function(values) {
          var isTeamMember = values[0];
          var teams = values[1];

          teams.sort(function(a, b){ return a.createdAt - b.createdAt; });

          var time = moment();
          var timeFormat = 12; // hardcode default for now

          var toJSONMethod = isOwner ? 'toOwnerJSON' :
                             isTeamMember ? 'toTeamJSON' :
                             'toJSON';

          res.render('person', {
            title: strings.capFirst(user.name || ''),
            profileUser: user[toJSONMethod](),
            teams: teams,
            time: time,
            timeFormat: timeFormat,
            message: req.flash('message'),
            errors: req.flash('error')
          });

        }, function() {
          next();
        });

    }, function(err) {
      next();
    });

};

people.myProfile = function(req, res) {
  if (!req.user)
    return res.redirect('/login');
  res.redirect(getProfileUrl(req.user));
};

people.getStarted = function(req, res, next) {

  if (!req.user)
    return res.redirect('/login');

  res.render('getStarted', {
    time: moment(),
    timeFormat: 12 // hardcode default for now
  });
};

people.save = function(req, res, next) {

  if (!req.user)
    return res.redirect('/login');

  var usernameOrId = req.params.usernameOrId;

  // User can only save their own data :)
  var canEdit = req.user._id.toString() === usernameOrId ||
                req.user.username === usernameOrId;
  // TODO - Add error message on new profile design:
  if (!canEdit)
    return res.redirect(getProfileUrl(req.user));

  if (req.body.coords) {
    try {
      var parts = req.body.coords.split(',');
      req.body.coords = {
        lat: parseFloat(parts[0]) || 0,
        long: parseFloat(parts[1]) || 0
      };
    } catch (err) {
      delete req.body.coords;
    }
  } else {
    req.body.coords = {};
  }

  for (var key in req.body) {
    if (UserModel.ADMIN_WRITABLE_FIELDS.indexOf(key) > -1) {
      req.user[key] = req.body[key];
    }
  }

  req.user.save(function(err) {
    // TODO - handle this error w/ message on profile
    //if (err)
    res.redirect(getProfileUrl(req.user));
  });

};
