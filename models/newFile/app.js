const express= require("express");
const app=express();
const ejsmate=require("ejs-mate");
app.set("view engine","ejs");
app.engine("ejs",ejsmate);
app.listen(3000,console.log("This is listeneing"));
app.get("/",(req,res)=>{
    res.render("new.ejs");
})