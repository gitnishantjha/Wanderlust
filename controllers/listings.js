//applying MVC in our code to make it more readable
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});


module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};
//add new listing
module.exports.renderNewForm = (req, res) => {
  //console.log(req.user);

  res.render("listings/new.ejs");
  console.log("Working");
};


//show 
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner");
  if (!listing) {
    req.flash("error", "Listing does not exit!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//search
module.exports.sear=async (req, res) => {
res.send("hello");
};







//create 
module.exports.createListing = async (req, res, next) => {
  let response=await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();
 
  
  let url = req.file.path;
  let filename = req.file.filename;
 
  const newListing = new Listing(req.body.listing);//creating the instance of listing

  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry=response.body.features[0].geometry;
  await newListing.save();//save our dat in the database
  
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};


//edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing does not exit!");
    res.redirect("/listings");
  }
  let originalImageUrl=listing.image.url;
  originalImageUrl.replace("/upload","/upload/w_250")
  res.render("listings/edit.ejs", { listing,originalImageUrl });
};


//updtae
module.exports.updateListing = async (req, res) => {
  // if(!req.body.listing){ // if this post req is called  by hopscoth and postman then the this if statement will handle the error.
  //     throw new ExpressError(400,"send valid data for listing");
  // }
  let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listings Updated Successfully!");
  res.redirect(`/listings/${id}`);

};

//delete

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
