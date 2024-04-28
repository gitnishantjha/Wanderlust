const mongoose = require("mongoose");
const Schema = mongoose.Schema;//creating a reference to schema class
const Review=require("./review.js");
//const Owner=require("/user.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
     url:String,
     filename:String,
  },
  price: Number,
  location: String,
  country: String,
  reviews:[{
    type:Schema.Types.ObjectId,
    ref:"Review",
  },
],
owner:{
  type:Schema.Types.ObjectId,
  ref:"User",
},
geometry:{
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    //required: true
  },
  coordinates: {
    type: [Number],
    //required: true
  },
},

});
// category:{
//   type:String,
//   enum:["mountains","arctic"]
// }

listingSchema.post("findOneAndDelete", async(listing)=>{
  if(listing){
   await Review.deleteMany({_id:{$in :listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema); // this line is creating a model named as "Listing" based on the specified info in listingSchema
module.exports = Listing; // exporting the Listing and "Listing" is the value that will be exported.
