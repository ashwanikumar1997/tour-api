/**
 * @file AccountsController
 **/
const normalizeForSearch = require("../utils/strings/normalizeforsearch");
const restObjectController = require("../services/restobjectcontroller"); //common function include - get all, delete etc
const formatForOutput = require("../services/accounts/formatforoutput");
const FacebookTokenStrategy = require("passport-facebook-token");
const handleMediaUpload = require("./accounts/mediaupload");
const userSettings = require("../../config/usersettings");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const enqueue = require("../services/enqueue");
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "f!wb0n#wfj7g9922hadlalx@"

module.exports = {
  all: restObjectController.all(User, "users"),

  get: restObjectController.get("account", (req, res, user, next) => {
    if (user.enable) {
      res.send({
        account: formatForOutput(user, req.user && req.user.isAdmin()),
      });
    } else {
      res
        .status(404)
        .send({ success: false, message: "Unable to find requested user" });
    }
  }),

  me: (req, res, next) => {
    //console.log(req);
    var userAccount = req.user;
    if (userAccount && userAccount.isUser()) {
      var user = userAccount.getModel();
      var preferences = user.preferences ? user.preferences : {};
      var me = {
        // id: user._id,
        displayName: user.name,
        email: user.email ? user.email : "",
        preferences: {
          gender: user.preferences.gender,
          location: user.preferences.location,
          radius: user.preferences.radius,
        },
      };
      //console.log(me)
      res.send(me);
    } else {
      res.status(400).send({ success: false, message: "Not a user" });
    }
  },

  checkusername: (req, res, next) => {
    var config = req.app.get("config");
    var appKey = config.app.key;
    var body = req.body;
    var username = body.username;
    User.findByUsername(username, (err, user) => {
      // user is still not found, he doesn't exist (this time for sure)
      if (user) {
        res.send({
          success: false,
          msg: "Username taken",
        });
      } else {
        res.send({
          success: true,
        });
      }
    });
  },
  // user login
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      // Compare passwords
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      
      res.cookie("accessToken", token)
      .json({ token, success: true, user });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  // register user
  register: (req, res, next) => {
    let config = req.app.get("config");
    let appKey = config.app.key;

    let body = req.body;
    let email = body.email;
    let name = body.name;
    let password = body.password;

    let accountType = body.accountType;

    User.find({email}, (err, user) => {
      if (err) {
        next(err);
      } else if (user.length > 0) {
        res.status(309).json({
          success: false,
          message:
            "A user already exists for this email address.  Try logging in.",
          type: "email_exists",
        });
        
      } else {
        let user = new User({
          name,
          email,
          accountType,
        });
        user.setPassword(password, (err) => {
          if (err) {
            res.status(500).send({
              success: false,
              message: "An unknown error occurred while creating your account",
            });
          } else {
            user.save(function (err, user) {
              if (err) return next(err);

              let data = {
                userId: user._id,
              };
              jwt.sign(data, appKey, {}, (err, token) => {
                if (err) {
                  res.status(500).send({
                    message: "There was an issue retrieving an account token.",
                  });
                  return;
                }
                res.send({
                  success: true,
                  token,
                });
              });
            });
          }
        });
      }
    });
  },

  handleMediaUpload: handleMediaUpload,

  deleteMyself: (req, res, next) => {
    let confirm = req.body.confirm;
    if (true === confirm) {
      var user = req.user.getModel();
      user.enable = false;
      user
        .save()
        .then(() => {
          res.send({
            success: true,
          });
        })
        .catch(next);
    } else {
      res.status(400).send({
        success: false,
        message: "You must explicitly set {confirm:true} to delete account",
      });
    }
  },

  delete: (req, res, next) => {
    let confirm = req.body.confirm;

    if (true === confirm) {
      var user = req.account;

      user.enable = false;

      user
        .save()
        .then(() => {
          res.send({
            success: true,
          });
        })
        .catch(next);
    } else {
      res.status(400).send({
        success: false,
        message: "You must explicitly set {confirm = true} to delete account",
      });
    }
  },

  search: (req, res, next) => {
    if (!req.query.q || req.query.q.length == 0) {
      res.status(400).send({
        success: false,
        message: "Missing q parameter",
        test: req.query,
      });
      return;
    }

    var keyword = new RegExp("^" + normalizeForSearch(req.query.q));
    var limit = 20;
    var offset = req.query.offset ? parseInt(req.query.offset) : 0;

    var userQuery = User.find({
      searchableName: keyword,
      enable: true,
    }).limit(limit);

    var userQuery2 = User.find({
      username: keyword,
      enable: true,
    }).limit(limit);

    if (offset > 0) userQuery.skip(offset);

    userQuery
      .exec()
      .then((users) => {
        userQuery2
          .exec()
          .then((users2) => {
            var allUsers = users.concat(users2);
            var accounts = allUsers.map(formatForOutput);
            res.send({ accounts });
          })
          .catch(next);

        /*
                                var accounts = users.map(formatForOutput);
                                res.send({accounts});
                */
      })
      .catch(next);
  },
};
