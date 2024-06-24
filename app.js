const express=require("express");
const mongoose=require("mongoose");
const path=require("path");
const app= express();
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const Exception=require("./utils/ExpressError.js");
const {listingSchemas}=require("./schema.js");
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
const listingSchema=require("./models/listing.js");
const port=3000;
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.listen(port,()=>{
    console.log("The port is listening");
})
app.get("/",wrapAsync((req,res)=>{
    res.send("Hey!! myan I am the root.")
}))
app.get("/listing",wrapAsync(async (req,res)=>{
    let arr=await listingSchema.find({});
    console.log(arr);
    res.render("index.ejs",{arr});
}))
app.get("/listing/new",wrapAsync((req,res)=>{// it should not be written after the listing/:id --> becuase first it takes new as 
  //also an id thats why the /listing/new is taken first and then /listing/:id;
  console.log("this is new section")
  res.render("something.ejs");
}))
app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
    let{id}=req.params;
    console.log("editing");
    console.log(req.params);
    let arr=await listingSchema.findById(id); 
    console.log(arr);
    res.render("edit.ejs",{arr});
}))
app.get("/listing/:id",wrapAsync(async (req,res)=>{
  let {id}=req.params;
  console.log("showing");
  console.log(req.params);
  let arr=await listingSchema.findById(id);
  res.render("show.ejs",{arr});
}))
app.delete("/listing/:id",wrapAsync((req,res)=>{
  let {id}=req.params;
  console.log("delete");
  console.log(req.params);
  listingSchema.findByIdAndDelete(id).then(()=>{res.redirect("/listing")});
}))
app.patch("/listing",wrapAsync((req,res)=>{
  console.log(req.body);
  let title1=req.body.title;
  let description1=req.body.description;
  listingSchema.findOneAndUpdate({title:title1},{description:description1}).then(()=>{  res.redirect("/listing");})
}))
app.post("/listing",async (req,res)=>{
  try{
    if(!req.body){
      throw new Exception(400,"bad request")
    }
    listingSchemas(req.body);
    let arr=req.body;
    let arr1=new listingSchema(arr);
    await arr1.save();
    res.redirect("/listing");}
    catch(err){
      res.send(err.message);
    }
})
app.all("*",(req,res,next)=>{
  next(new Exception(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let { status=500, message="something went wrong" }=err;
  res.render("error.ejs",{err});
  // res.status(status).send(message);
})