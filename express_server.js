const express = require("express");
const morgan = require("morgan");
const app = express();
const PORT = 8080; // default port 8080
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.set("view engine", "ejs");
app.use(morgan('dev'));

app.get("/urls/:shortURL", (req, res) => {
 const longURL = urlDatabase[req.params.shortURL]
  const templateVars = { 
    longURL,
    shortURL : req.params.shortURL
 
  };  
  
  res.render("urls_show", templateVars);

});



app.get("/urls/", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});



app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});