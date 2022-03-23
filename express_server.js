const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000; // default port 8080


app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};

// - Post Registration Form 

app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  users[id] = {id, email, password};
  res.cookie("user_id", id);
  res.redirect("/urls");
  
});



// -- Get Registration Form

app.get("/register", (req, res) => {

  const templateVars = { urls: urlDatabase,
    username : req.cookies["username"]
  };

  res.render("urls_template", templateVars)
});




//--Logout

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");

  
});



//--Username Login 

app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
 
  const templateVars = { urls: urlDatabase,
    username : req.cookies["username"]
  };

  res.render("urls_index", templateVars);

});

//--Edit a long Url 

app.post("/urls/:shortUrl", (req, res) => {
  const shortURL = req.params.shortUrl;
  const longURL = req.body.longURL;
  urlDatabase [shortURL] = longURL;
  
});



//-- Generating the delete button

app.post("/urls/:shortURL/delete", (req, res) => {

  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");

});






// -- Generating a short Url

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  const id = generateRandomString();
  if (!longURL.includes("http")) {
    longURL = "https://" + longURL;
  }
  urlDatabase[id] = longURL;

  res.redirect(`/urls/${id}`);
});

app.get("/urls/new", (req, res) => {
  
  const templateVars = {
    username : req.cookies["username"]
  };
  
  res.render("urls_new", templateVars);
});

// -- Rendering show page

app.get("/urls/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars = {
    longURL,
    shortURL: req.params.shortURL,
    username : req.cookies["username"]
  };

  res.render("urls_show", templateVars);

});


// -- short Url with redirection to longURL website 

app.get("/urls/", (req, res) => {
  const templateVars = { urls: urlDatabase,
    username : req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);

});




app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});