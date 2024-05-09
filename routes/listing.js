const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");//requiring the listing.js from models directory
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
//file ke form me jo image aa rhi hai usko parse karke ye multer ek upload folder me save karega
const multer = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

//the get and post request that will come to "/" will be handled by router.route function here we added the code of our index route and create route.
router.route("/")
    .get(wrapAsync(listingController.index))
     .post(isLoggedIn, upload.single('listing[image]') ,validateListing,wrapAsync(listingController.createListing));
     

//NEW route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


// //index route
// router.get("/", wrapAsync(listingController.index));




// //show route
// router.get("/:id", wrapAsync(listingController.showListing));



// //create route
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing)
// );

//Edit route
//-> in Edit route as we can only use "GET" or "PUT" in our form so we will install npm i method-override package
//after installing we will pass one query String "?_method=PUT"
// after this add these two lines in header.1>  app.use(methodOverride("_merthod")); 2>const methodOverride=require("method-override");
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));


// //update route
// router.put("/:id", isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

// //Delete Route
// router.delete("/:id", isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));
// router.get('/search',wrapAsync(listingController.searchlisting));


module.exports = router;

