const Listing=require("../models/listing.js");//requiring the listing.js from models directory
const Review=require("../models/review.js");


module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added!");
    
    res.redirect(`/listings/${listing._id}`);
    };

module.exports.distroyReview=async(req, res)=>{
    let { id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id , {$pull: {reviews : reviewId}}); //pull kr ke remove kr rhe hain
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","New Review Deleted!");

    res.redirect(`/listings/${id}`);
};