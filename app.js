//jshint esversion:6
 const express = require("express");
 const bodyParser = require("body-parser");
 const ejs = require("ejs");
 const mongoose = require("mongoose");


 const app = express();

 app.use(express.static("public"));
 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({
   extended: true
 }));

///***** Set Mogo Db connection **********/////////////
 mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true},
{ useUnifiedTopology: true });
////****** Create Schema for DB **** /////
 const userSchema = {
   email: String,
   password: String
 }
////********* Create a Collection called User *******///////
 const User = new mongoose.model("User", userSchema);
//////******** Routes *******/////////////
 app.get("/", function(req, res){
   res.render("home");
 });

 app.get("/login", function(req, res){
   res.render("login");
 });

 app.get("/register", function(req, res){
   res.render("register");
 });

////****** Get date from register and regiter a new user ******//////////
 app.post("/register", function(req, res){
   const newUser = new User({  // creating new record
     email: req.body.username,
     password: req.body.password
   });

   newUser.save(function(err){ //saving date to User collection
     if(err){
       console.log(err);
     } else {
       res.render("secrets");
     }
   });
 });
////////***** Login and checking user and password to enter *****///////
 app.post("/login", function(req, res){
   const username = req.body.username;
   const password = req.body.password;

   User.findOne({email: username}, function(err, foundUser){
     if(err){
       console.log(err);
     } else {
       if(foundUser){
         if(foundUser.password === password){
           res.render("secrets");
         }
       }
     }
   });
 });

app.listen(3000, function(){
  console.log("Server running on port 3000")
})
