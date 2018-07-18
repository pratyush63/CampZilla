var Campsite  =require("../models/campsite");
var Comment   =require("../models/comment");

var middlewareObj={};

middlewareObj.isLoggedIn=function(req,res,next){
   if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","In order to do that, Please LogIn !");
    res.redirect("/login"); 
};


middlewareObj.checkcampsiteownership=function(req,res,next){
 if(req.isAuthenticated()){
        Campsite.findById(req.params.id,function(err,foundcampsite){
            if(err || !foundcampsite){
                req.flash("error","Unfortunately,the CampSite was not found!");
                res.redirect("/campsites");
            }
            else{
                if((foundcampsite.author.id.equals(req.user._id))||(req.user.isAdmin))
                next();
                else{
                req.flash("Permission Denied!");
                res.redirect("/campsites");
            }
            }
        });
    }else{
        res.redirect("/campsites");
    }   
};


middlewareObj.checkcommentownership=function(req,res,next){
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundcomment){
            if(err || !foundcomment){
                req.flash("error","Comment not found!!");
                res.redirect("back");
            }
            else{
                if((foundcomment.author.id.equals(req.user._id))||(req.user.isAdmin))
                next();
                else{
                req.flash("error","Permission denied!"); 
                res.redirect("back");
            }
            }
        });
    }else{
        req.flash("error","In order to do that,Please LogIn!!");
        res.redirect("back");
    }   
};

module.exports=middlewareObj;