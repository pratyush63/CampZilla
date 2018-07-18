
var mongoose=require("mongoose");

//Schema
var campsiteSchema= new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt:{
        type:Date,default:Date.now
    },
    description:String,
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ],
    author:{
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
           },
        username:String
    }
});

module.exports=mongoose.model("Campsite", campsiteSchema);
