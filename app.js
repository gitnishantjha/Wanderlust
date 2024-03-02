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
const {listingSchema,reviewSchema}=require("./schema.js");//ye line grey out hui after adding listing and review section to the router directory as these lines are  no longer in use
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");

const session=require("express-session");
const flash=require("connect-flash");
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


//using sessions
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.get('/',(req,res)=>{ //making the api call for root server
    res.send("Hi..root is working");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
   
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");

    next();
});
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);





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