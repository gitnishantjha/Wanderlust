const express=require("express");
const router=express.Router({mergeParams: true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");//requiring the listing.js from models directory
const{validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");


//Reviews
//post Reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete reviews route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.distroyReview));

module.exports=router;



