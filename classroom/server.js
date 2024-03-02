const express =require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
//const cookieParser=require("cookie-parser");
//app.use(cookieParser("secretcode"));
const path=require("path");
const session=require("express-session");
const flash=require("connect-flash");
app.set("view engine","ejs");//this line tells the app to use EJS for rendering dynamic content on the server side before sending it to the client
app.set("views", path.join(__dirname,"views")); //joining the path of views directory


const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());


app.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
});

app.get("/register",(req,res)=>{
    let {name= "anonymous"}=req.query;
    req.session.name=name;

    if(name==="anonymous"){
        req.flash("error","user not registered");
    }else{
        req.flash('success','user registered successfully!');
    }
   
    res.redirect("/hello") ;
});
app.get("/hello", (req,res)=>{
    res.render("page.ejs", {  name: req.session.name });
});



// reqcount function ka use
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){// req.session ek single session ko track krta hai .it will increase as the no of visits increases on the website
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }

//     res.send(`you sent a request ${req.session.count} times`);
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","India",{signed:true}); //signed likh ke hm stamp lga rhe hain taki koi koi tampering na ho cookies ke sath
//     res.send("signed cookie sent");
//     //console.dir(req.cookies);
// });

// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","hello");
//     res.send("sent you some cookies");
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     res.send("verified");
// });
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Hi,${name}`);
// });
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi, I am root!");
// });
// app.use("/users",users);//jo bhi route /users se suru hoga use match kiya jayega bache hue route se agar match hoti hai to wo specific route execute ho jayegi(mapping users file ke andar karni hai)
// app.use("/posts",posts);


app.listen(3000,(req,res)=>{
   console.log("server is listening to port");
});

