const express=require('express');//connection of express
const app=express();
const mongoose=require('mongoose');//connection of mongoose
const Listing=require("./models/listing.js");//requiring the listing.js from models directory
const Review=require("./models/review.js");
const methodOverride=require("method-override");//used when we want to use DELETE or PUT operatin in the form
//after installing ejs-mate for our template we aare going to require it.
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

//To set up the ejs 
//step 1
const path=require("path");
//*make a "views" folder , in this folder we will make templates.
//inside it we are making a new folder name Listing in which we will save all the listing related things
//inside listing make index.ejs
app.set("view engine","ejs");//this line tells the app to use EJS for rendering dynamic content on the server side before sending it to the client
app.set("views", path.join(__dirname,"views")); //joining the path of views directory
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));//used when we want to update the data using PUT in form.
app.engine('ejs',ejsMate);//using ejsMate
app.use(express.static(path.join(__dirname,"/public"))); // if we use public directory where we are making a styling folder i.e styles.css then we have to write this line


let Mongo_url="mongodb://127.0.0.1:27017/Wanderlust";
main().then(()=>{ //since main is the asyncronous we are using .then to execute the function but if sny error ocuured then the catch function will get ec=xecute
    console.log("connected to DB"); //connecting to database
}).
catch(err=>console.log(err)); 

async function main(){ //await keyword is used in async function to wait till the connection happens but in case of mongoose the server will not stop the intialization of data,means the moment the database will get connected the data will be ready to get initialized into the data base
await mongoose.connect(Mongo_url); //connecting the mongoose through the main()
};


app.get('/',(req,res)=>{ //making the api call for root server
    res.send("Hi..root is working");
});


//validation of Schema(middleWare)
const validateListing=(req,res,next)=>{
    let {error}=  listingSchema.validate(req.body);//jo listing schema ke andar hmne requiremn=ments likha hai joi ke form me kya  req.body  validate ho paa rhi hai
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//index route
app.get("/listings",
wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
})
);

//NEW route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
   console.log("Working");
}
);
//show route
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
  const listing =await Listing.findById(id).populate("reviews");
  res.render("listings/show.ejs",{listing});
}));


//create route
app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
     
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
  // let {title,description,image,price,country,location}=req.body; 
   //let listings=req.body; //this will return the listing object
   
    const newListing=new Listing(req.body.listing);//creating the instance of listing
    await newListing.save();//save our dat in the database
    res.redirect("/listings");    
   })
);

//Edit route
//-> in Edit route as we can only use "GET" or "PUT" in our form so we will install npm i method-override package
//after installing we will pass one query String "?_method=PUT"
// after this add these two lines in header.1>  app.use(methodOverride("_merthod")); 2>const methodOverride=require("method-override");
app.get("/listings/:id/edit", wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
   res.render("listings/edit.ejs",{listing});
}));

//update route
app.put("/listings/:id", validateListing,wrapAsync(async(req,res)=>{
    // if(!req.body.listing){ // if this post req is called  by hopscoth and postman then the this if statement will handle the error.
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let {id}=req.params;
   await Listing.findByIdAndUpdate(id,{...req.body.listing});
   res.redirect(`/listings/${id}`);

}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.deleteOne({_id:id});
  res.redirect("/listings");
}));

//post Reviews route
app.post("/listings/:id/reviews",validateReview,
wrapAsync(async(req,res)=>{
let listing=await Listing.findById(req.params.id);
let newReview=new Review(req.body.review);

listing.reviews.push(newReview);
await newReview.save();
await listing.save();

res.redirect(`/listings/${listing._id}`);
}));

//Delete reviews route

app.delete("/listings/:id/reviews/:reviewId",
wrapAsync(async(req, res)=>{
    let { id , reviewId}=req.params;
    await Listing.findByIdAndUpdate(id , {$pull: {reviews : reviewId}}); //pull kr ke remove kr rhe hain
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
})
);








// app.get('/testListening',async (req,res)=>{//this route is made to add a new data into the database using  the schema initialized in the listing.js
// let sampleListing=new Listing({ //creating the new listing based on the Schema defined on lising.js
//     title:"My new Villa",
//     description: "By the beach",
//     price:1200,
//     location:"calangute, Goa",
//     country:"India",
// });

// await sampleListing.save(); //saving data in the database.save() is a async function so we used await.
// console.log("sample was saved");
// res.send("successful testing");
// });



//error handling middleware for server side

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));  
  });


app.use((err,req,res,next)=>{
    let {status=500,message}=err;
    // res.status(status).send(message); ->to print the message on the screen
    res.status(status).render("error.ejs",{err});
});



app.listen(8080,()=>{ //the working port of localhost where our server is hosted
    console.log("server is listening to port");
});