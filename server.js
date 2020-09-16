const express=require('express');
const app=express();
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firm: String,
    bank: String,
    accno: Number,
    ifsc: String,
    branch: String
})

const User=mongoose.model("User",userSchema);
const convertrs=require('convert-rupees-into-words');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine','ejs');


app.get("/add", function (req, res) {
    res.render('addform');
})

app.post("/add", function (req, res) {
    const user = new User({
        firm: req.body.firm,
        bank: req.body.bank,
        accno: req.body.accno,
        ifsc: req.body.ifsc,
        branch: req.body.branch
    });
    user.save();
    res.redirect("/");
});

app.get("/",function(req,res){
    mongoose.connect('mongodb+srv://admin-shivank:Test123@cluster0.vjstt.mongodb.net/usersDB', { useNewUrlParser: true, useUnifiedTopology: true });
    User.find(function(err,users){
        if(err){
            console.log(err);
        }else{
            res.render('filldetails',{users:users})        
        }
    });
})

app.post("/",function(req,res){
    //find user details create an object and render final using that object
    let total=req.body.total;
    let words = convertrs(Number(total));
    let firm=req.body.firm;
    User.findOne({ firm: firm }, function (err, user){
        if(err){
            console.log(err);
        }else{
            const obj = {
                total: Number(req.body.total),
                accno: user.accno,
                firm: firm,
                branch: user.branch,
                bank: user.bank,
                ifsc: user.ifsc,
                words: words.substr(0, words.length - 6) + " Only"
            }
            mongoose.connection.close();
            res.render('final', obj);

        }
    });
    
})

let port=process.env.PORT;
if(port==null || port==""){
    port=3000;
}


app.listen(port,()=>{
    console.log("server started at "+port);
});
