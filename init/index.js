const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");//requiring all the dc


let Mongo_url="mongodb://127.0.0.1:27017/Wanderlust";//storing the url in a variable
main().then(()=>{
    console.log("connected to DB");
}).
catch(err=>console.log(err));

async function main(){
await mongoose.connect(Mongo_url);
}


const initDB=async()=>{ //creating an async func which will put all data into the database 
    await Listing.deleteMany({});//deleting all the old data that is present in database
    await Listing.insertMany(initData.data);//initializing and saving all the data in the listing (table)/
    console.log("data was initialized");
};
initDB(); //calling the function;