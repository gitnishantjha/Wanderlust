const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");//requiring the listing.js from models directory
const { isLoggedIn } = require("../middleware.js");

//validation of Schema(middleWare)
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);//jo listing schema ke andar hmne requiremn=ments likha hai joi ke form me kya  req.body  validate ho paa rhi hai

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//index route
router.get("/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//NEW route
router.get("/new", isLoggedIn, (req, res) => {
  //console.log(req.user);

  res.render("listings/new.ejs");
  console.log("Working");
}
);
//show route
router.get("/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews").populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exit!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
}));


//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

  // if(!req.body.listing){
  //     throw new ExpressError(400,"send valid data for listing");
  // }
  // let {title,description,image,price,country,location}=req.body; 
  //let listings=req.body; //this will return the listing object

  const newListing = new Listing(req.body.listing);//creating the instance of listing
  console.log(req.user);
  newListing.owner = req.user._id;
  await newListing.save();//save our dat in the database
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
})
);

//Edit route
//-> in Edit route as we can only use "GET" or "PUT" in our form so we will install npm i method-override package
//after installing we will pass one query String "?_method=PUT"
// after this add these two lines in header.1>  app.use(methodOverride("_merthod")); 2>const methodOverride=require("method-override");
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exit!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
}));

//update route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  // if(!req.body.listing){ // if this post req is called  by hopscoth and postman then the this if statement will handle the error.
  //     throw new ExpressError(400,"send valid data for listing");
  // }
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listings Updated Successfully!");

  res.redirect(`/listings/${id}`);

}));

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
}));
module.exports = router;

