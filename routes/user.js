const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync");
const passport=require("passport");
const {savedRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");
const listingController = require("../controllers/listings.js");

router.route("/").get(listingController.index);
// router.get("/").get(userController.index);
//signup route
router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup);

//login route
router.route("/login")
.get(userController.renderLoginForm)
.post(savedRedirectUrl,
passport.authenticate("local",
{failureRedirect:"/login",
failureFlash:true,}),
userController.login
);

//logout functionality
router.get("/logout",userController.logout);
module.exports=router;
