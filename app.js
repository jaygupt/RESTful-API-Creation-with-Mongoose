//jshint esversion:6

// require packages 
const bodyParser = require("body-parser"); 
const ejs = require("ejs"); 
const express = require("express"); 
const mongoose = require("mongoose"); 

const app = express(); 

app.set("view engine", "ejs"); 

app.use(bodyParser.urlencoded({
  extended: true 
})); 

app.use(express.static("public")); 

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/wikiDB", 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
); 

// create an article schema
const articleSchema = {
  title: String,
  content: String
}

// create an article model
const Article = mongoose.model("Article", articleSchema); 

// READ all articles
app.get("/articles", function(req, res){
  Article.find({}, function(err, foundArticles){
    if (!err) {
      res.send(foundArticles); 
    } else {
      res.send(err);
    }
  });
});

// CREATE an article
app.post("/articles", function(req, res){
  const newTitle = req.body.title; 
  const newContent = req.body.content;
  
  const newArticle = new Article({
    title: newTitle,
    content: newContent
  }); 

  newArticle.save(function(err){
    if (!err) {
      res.send("Successfully added a new article."); 
    } else {
      res.send(err); 
    }
  }); 
});

app.listen(3000, function(){
  console.log("Server started on port 3000."); 
});