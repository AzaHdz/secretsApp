//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const encrypt = require("mongoose-encryption");
//const md5 = require("md5");
const bcrypt = require("bcrypt"); //Look at bcrycp documentation
const saltRounds = 10;

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

///***** Set Mogo Db connection **********/////////////
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
////****** Create Schema for DB and encrypt password **** /////
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


//userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields:["password"]});
////********* Create a Collection called User *******///////
const User = new mongoose.model("User", userSchema);
//////******** Routes *******/////////////
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

////****** Get date from register and regiter a new user ******//////////
app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //Creatin a hash with 10 rounds of salt
    const newUser = new User({ // creating new record
      email: req.body.username,
      password: hash  //now the password is a hash
    });
    newUser.save(function(err) { //saving user info to User collection
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

});
////////***** Login and checking user and password to enter *****///////
app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          // Load hash from your password DB.
          bcrypt.compare(password, foundUser.password, function(err, result) { //comparing the hash of the password
            // result == true
            if(result === true){
              res.render("secrets");
            }
          });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server running on port 3000")
});
