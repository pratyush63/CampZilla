var express  =require("express");
var router   =express.Router();

var Campsite  =require("../models/campsite");
var middleware=require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

router.get("/",function(req,res){
    Campsite.find({}, function(err, allcampsites){
        if(err){
            console.log(err);
        }
        else{
            res.render("campsites/index",{campsites:allcampsites, currentUser:req.user});
        }
    });
});
//router.post("/",middleware.isLoggedIn,function(req,res){
//    var name=req.body.name;
//    var price=req.body.price;
//    var image=req.body.image;
//    var description=req.body.description;
//    var author={
//        id:req.user._id,
//        username:req.user.username
//    };
//    var newCampsite={name: name,price:price,image: image, description:description,author:author};
//    Campsite.create(newCampsite, function(err, newcampsite){
//        if(err){
//            console.log(err);
//        }
//        else{
//            res.redirect("/campsites");
//        }
//    });
    
//});
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to campsites array
  var name = req.body.name;
  var price=req.body.price;
  var image = req.body.image;
  var description=req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCampsite = {name: name, image: image,price:price,description: description, author:author, location: location, lat: lat, lng: lng};
    // Create a new campsite and save to DB
    Campsite.create(newCampsite, function(err, newcampsite){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newcampsite);
            res.redirect("/campsites");
        }
    });
  });
});

router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campsites/new",{currentUser:req.user});
});

router.get("/:id",function(req,res){
    Campsite.findById(req.params.id).populate("comments").exec(function(err,foundcampsite){
        if(err || !foundcampsite){
            req.flash("error","CampSite not found !! ");
            res.redirect("/campsites");
        }
        else{
        res.render("campsites/show", {campsite:foundcampsite ,currentUser:req.user});    
    }
    
});
});
//Edit & Update Routes----------------------------------------------------------
router.get("/:id/edit",middleware.checkcampsiteownership,function(req,res){
    Campsite.findById(req.params.id, function(err,foundcampsite){
            res.render("campsites/edit",{foundcampsite:foundcampsite,currentUser:req.user});
    });
});

//router.put("/:id",middleware.checkcampsiteownership,function(req,res){
//    Campsite.findByIdAndUpdate(req.params.id,req.body.campsite,function(err,updatedcampsite){
//        if(err){
//            res.redirect("/campsites");
//        }
//        else{
//            res.redirect("/campsites/"+req.params.id);
//        }
//    });
//});
// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkcampsiteownership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.campsite.lat = data[0].latitude;
    req.body.campsite.lng = data[0].longitude;
    req.body.campsite.location = data[0].formattedAddress;

    Campsite.findByIdAndUpdate(req.params.id, req.body.campsite, function(err, campsite){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campsites/" + campsite._id);
        }
    });
  });
});
//------------------------------------------------------------------------------
//Delete Route------------------------------------------------------------------
router.delete("/:id",middleware.checkcampsiteownership,function(req,res){
    Campsite.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campsites");
        }
        else{
            req.flash("success","CampSite successfully deleted!");
            res.redirect("/campsites");
        }
    });
});
//------------------------------------------------------------------------------

module.exports=router;