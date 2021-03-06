//jshint esversion:6

// require packages 
const bodyParser = require("body-parser");  
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

// targeting all articles 
app.route("/articles")
  .get(function(req, res){
    // READ all articles
    Article.find({}, function(err, foundArticles){
      if (!err) {
        res.send(foundArticles); 
      } else {
        res.send(err);
      }
    });
  })
   
  .post(function(req, res){
    // CREATE an article
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
  })

  .delete(function(req, res){
    // DELETE all articles
    Article.deleteMany({}, function(err){
      if (!err) {
        res.send("Deleted all articles.");
      } else {
        res.send(err); 
      }
    });
  }); 
  
// targeting specific articles
app.route("/articles/:articleTitle") 
  .get(function(req, res){
    // READ a SPECIFIC article 
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle}, function(err, foundArticle){
      if (!err) {
        res.send(foundArticle); 
      } else {
        res.send(err); 
      }
    }); 
  })

  .put(function(req, res){
    // replace a SPECIFIC article
    const articleTitle = req.params.articleTitle;
    Article.replaceOne(
      {title: articleTitle},
      {
        title: req.body.title,
        content: req.body.content
      }, 
      function(err, activity){
        if (!err) {
          res.send(activity); 
        } else {
          res.send(err); 
        }
      }
    ); 
  })

  .patch(function(req, res){
    // modify certain part of document 
    const articleTitle = req.params.articleTitle; 
    Article.updateOne(
      {title: articleTitle},
      req.body,
      function(err, activity){
        if (!err) {
          res.send(activity); 
        } else {
          res.send(err); 
        }
      }
    );
  })

  .delete(function(req, res){
    // DELETE CERTAIN article 
    const articleTitle = req.params.articleTitle; 
    Article.deleteOne(
      {title: articleTitle},
      function(err) {
        if (!err) {
          res.send("Deleted article."); 
        } else {
          res.send(err)
        }
      }
    );    
  }); 

app.listen(3000, function(){
  console.log("Server started on port 3000."); 
});