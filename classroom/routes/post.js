const express=require("express");
const router=express.Router();//creating the router object

//Posts
//Index 
router.get("/",(req,res)=>{
    res.send("Get for posts");
});
  
//show
router.get("/:id",(req,res)=>{
    res.send("Get for post id");
});

//Post 
router.post("/:id",(req,res)=>{
    res.send("Post for posts");
});

//delete
router.delete("/:id",(req,res)=>{
    res.send("Delete for  post id");
});

module.exports=router;