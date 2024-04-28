const User=require("../models/user.js");
//signup form for the users
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
};

//signup for the users 
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
       
    }catch(e){
       req.flash("error",e.message);
       res.redirect("/signup");
    }
};


//login form rendering
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};


//after pssport does the login the mssg after login
module.exports.login=async(req,res)=>{
    req.flash("success","welocome to wanderlust! you are logged in!");
   let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
 }

 //logout

 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });

};




