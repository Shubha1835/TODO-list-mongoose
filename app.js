

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

const itemsSchema ={
  name:String
};

const Item =mongoose.model("Item",itemsSchema);

//Make a data for database

const item1=new Item({
  name:"Welcome to your to do list"
});

const item2=new Item({
  name:"Hit the + Button to add new Item"
});

const item3=new Item({
  name:"<--Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];




app.get("/", function(req, res) {

  Item.find({},function(err,foundItems){
    if(foundItems.length===0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Items are added succesfully into the db");
        }
      
      })
      res.redirect("/");
    }
    res.render("list", {listTitle:"Today", newListItems: foundItems});
    
  })
});




app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item=new Item({
    name:itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){

  // const deleteItem=req.body
  Item.findByIdAndDelete(req.body.checkbox,function(err){
    if(!err){

      console.log("Successfully deleted ");
      res.redirect("/");
    }

  })
  // console.log(req.body.checkbox);

})

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
