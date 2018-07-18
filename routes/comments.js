var express  =require("express");
var router   =express.Router({mergeParams:true});

var Campsite  =require("../models/campsite");
var Comment   =require("../models/comment");
var middleware=require("../middleware");



router.get("/new",middleware.isLoggedIn, function(req,res){
    Campsite.findById(req.params.id, function(err,campsite){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campsite:campsite,currentUser:req.user}); 
        }
    });
       
});

router.post("/",middleware.isLoggedIn, function(req,res){
   Campsite.findById(req.params.id,function(err,campsite){
       if(err){
           console.log(err);
           res.redirect("/campsites");
       }
       else{
            var newComment=req.body.comment;
            Comment.create(newComment,function(err,newcomment){
            if(err){
            console.log(err);
            }
            else{
            newcomment.author.id=req.user._id;
            newcomment.author.username=req.user.username;
            newcomment.save();
            campsite.comments.push(newcomment);
            campsite.save();
            req.flash("success","Review successfully submitted!!");
            res.redirect("/campsites/"+campsite._id);
            }
           });
          }
         });
}); 

//Edit and Update Route---------------------------------------------------------s
router.get("/:comment_id/edit",middleware.checkcommentownership,function(req,res){
    Campsite.findById(req.params.id,function(err,campsite){
       if(err || !campsite){
           req.flash("error","CampSite not found!!");
           res.redirect("/campsites/"+campsite._id);
       }
       else{
    Comment.findById(req.params.comment_id, function(err,foundcomment){
            if(err){
                res.redirect("back");
            }
            else{
            res.render("comments/edit",{foundcomment:foundcomment,campsite:campsite,currentUser:req.user});
            }
            });
       }
    });
});
    
router.put("/:comment_id",middleware.checkcommentownership,function(req,res){
    Campsite.findById(req.params.id,function(err,campsite){
       if(err){
           console.log(err);
           res.redirect("/campsites/"+campsite._id);
       }
       else{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err)
            res.redirect("/campsites/"+campsite._id);
        else
            res.redirect("/campsites/"+campsite._id);
    });
       }
    });
});

//------------------------------------------------------------------------------
//Delete route------------------------------------------------------------------
router.delete("/:comment_id",middleware.checkcommentownership,function(req,res){
    Campsite.findById(req.params.id,function(err,campsite){
       if(err){
           console.log(err);
           res.redirect("/campsites/"+campsite._id);
       }
       else{
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err)
            res.redirect("/campsites/"+campsite._id);
        else{
            req.flash("success","Review successfully deleted!");
            res.redirect("/campsites/"+campsite._id);
        }
        });
       }
});
});

module.exports=router;