var express =require("express");
var router  =express.Router();
var passport=require("passport");

var User    =require("../models/user");

router.get("/",function(req,res){
    
    res.render("campsites/landing");
});
router.get("/about",function(req,res){
    res.render("campsites/about",{currentUser:req.user});
});

//Authentication Routes---------------------------------------------------------

router.get("/signup", function(req,res){
   res.render("signup",{currentUser:req.user}); 
});

router.post("/signup", function(req,res){
    var newUser=new User({username:req.body.username});
    var admincode=process.env.ADMINCODE;
    if(req.body.adminCode === admincode){
        newUser.isAdmin = true;
    }
    User.register(newUser,req.body.password,function(err,user){
       if(err){
           console.log(err);
           return res.render("signup",{"error":err.message, currentUser:req.user});
       } 
       passport.authenticate("local")(req,res,function(){
           req.flash("success","Welcome to Campzilla.Nice to meet you "+user.username+"!");
           res.redirect("/campsites");
       });
    });
});   

router.get("/login", function(req,res){
    res.render("login",{message: req.flash("error"),currentUser:req.user});
});

router.post("/login", passport.authenticate("local",{
   successRedirect:"/campsites",
   failureRedirect:"/login"
}),function(req,res){
    
});

router.get("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

module.exports=router;