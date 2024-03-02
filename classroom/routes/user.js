const express=require("express");
const router=express.Router();//creating the router object



//Index -users
router.get("/",(req,res)=>{
    res.send("Get for users");
});

//show -users
router.get("/:id",(req,res)=>{
    res.send("Get for  users id");
});

//Post -users
router.post("/:id",(req,res)=>{
    res.send("Post for users");
});

//delete- usrs
router.delete("/:id",(req,res)=>{
    res.send("Delete for users");
});

module.exports=router;