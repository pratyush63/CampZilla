require('dotenv').config();

var express    =require("express"),
 app           =express(),
 bodyParser    =require("body-parser"),
 mongoose      =require("mongoose"),
 flash         =require("connect-flash"),
 passport      =require("passport"),
 LocalStrategy =require("passport-local"),
 methodOverride=require("method-override"),
 Campsite      =require("./models/campsite"),
 Comment       =require("./models/comment"),
 User          =require("./models/user");

//Requiring all the routes------------------------------------------------------
var indexRoutes   =require("./routes/index"),
campsiteRoutes    =require("./routes/campsites"),
commentRoutes     =require("./routes/comments");
//------------------------------------------------------------------------------ 

var url=process.env.DATABASEURL||"mongodb://localhost/camp_zilla";
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment=require("moment");


//Configuring PassportJS------------------------------
app.use(require("express-session")({
    secret:"Use CampZilla to find CampSites in India",
    resave:false,
    saveUninitialized:false
}));

    
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//=====================================================

app.use(function(req,res,next){
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

//Using all the routes----------------------------------------------------------
app.use(indexRoutes);
app.use("/campsites",campsiteRoutes);
app.use("/campsites/:id/comments",commentRoutes);
//------------------------------------------------------------------------------
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YelpCamp server has started!");
});