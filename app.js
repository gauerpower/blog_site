require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const lodash = require("lodash");

const authenticationString = process.env.AUTHENTICATION_STRING;

const homeStartingContent =
  "Welcome to my blog site. See posts below, or go to the /compose page to write a new post.";
const aboutContent =
  "I built this website as part of a Udemy course project. It uses Node/Express, MongoDB/Mongoose, Bootstrap, and EJS.";
const contactContent =
  "Email me at gauer at jongauer dot com, or visit my GitHub at https://github.com/gauerpower/";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://" + authenticationString + ".mongodb.net/blogSiteDatabase", { useNewUrlParser: true });

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

const posts = [];

app.get("/", (req, res) => {
  Post.find({}, function (err, posts) {
    res.render("home", {
      homeStartingContent,
      posts,
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", { aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", { contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId }, function (err, post) {
    res.render("post", {
      title: post.title,
      content: post.content,
    });
  });
});

app.post("/compose", (req, res) => {
  const newPost = new Post({
    title: req.body.newEntryTitle,
    content: req.body.newEntryContent,
  });
  newPost.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server running.");
});
