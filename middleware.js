const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listings");
        return res.redirect("/login");
      }
      next();
};
module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

//middleware to authorixe the owner to delete and edit and update
module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the owner of the listings");
      return res.redirect(`/listings/${id}`);
    }
next();
};


//validation of Schema(middleWare)
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);//jo listing schema ke andar hmne requiremn=ments likha hai joi ke form me kya  req.body  validate ho paa rhi hai
  
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  };

  module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//middleware for authorization of deletion of review
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id, reviewId } = req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("error","you are not the author of this review");
      return res.redirect(`/listings/${id}`);
    }
next();
};
  