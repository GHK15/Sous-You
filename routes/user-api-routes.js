// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // console.log(req.user)
    // Since we're doing a POST with javascript, we can't actually redirect that post into a GET request
    // So we're sending the user back the route to the members page because the redirect will happen on the front end
    // They won't get this or even be able to access this page if they aren't authed
    res.json("/profile");
  });
   // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    console.log(req.body);
    db.User.create({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      zipCode: req.body.zipCode,
      userPreference: req.body.userPreference
    }).then(function() {
      res.redirect(307, "/api/login");
    }).catch(function(err) {
      console.log(err);
      res.json(err);
      // res.status(422).json(err.errors[0].message);
    });
  });

  // Get all users
  app.get("/api/user", function(req, res) {
    db.User.findOne({
      where: {
        id: req.user.id
      }
    }).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.get("/api/users", function(req, res) {
    db.User.findAll().then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.post("/api/user", function(req, res) {
    console.log(req.body)
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.get("/api/userzip", function (req, res) {
    db.User.findAll({
      where: {
        id: req.user.id,
        zipCode: req.user.zipCode
      }
    }).then(function(dbUser) {
    res.json(dbUser)
  })
    console.log(dbUser)
  });

  app.get("/api/grocery", function (req, res){
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(dbUser){
      res.json(dbUser)
    })
  });

  app.get("/api/recipe", function (req, res){
    db.User.findAll({
      where: {
        id: req.user.id
      }
    }).then(function(dbUser){
      res.json(dbUser)
    })
  });

  app.get("/api/category", function (req, res){
    db.User.findAll({
      where:{
        id: req.user.id
      }
    }).then(function(dbUser){
      re.json(dbUser)
    })
  });

  // Route for logging user out
  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    }
    else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
        preference: req.user.userPreference,
        zip: req.user.zipCode
        
      });
    }
  });

};
