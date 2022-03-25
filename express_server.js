const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cookieSession = require("cookie-session");
const { getUserByEmail, generateRandomString, urlsForThisUser, isLoggedIn } = require("./helpers");


const req = require("express/lib/request");
const app = express();
const PORT = 8000; // default port 8080


app.set("view engine", "ejs");
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: "session",
  keys: ['key1', 'key2']
}));


const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  },
  i4gRcd: {
    longURL: "http://www.facebook.com",
    userID: "a9col2"
  }
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
};




// Post Routes - Registeration Form

app.post("/register", (req, res) => {


  const { email, password } = req.body;
  const user = getUserByEmail(email, users);

  if (!email || !password) {
    return res.status(400).send("Fields cannot be empty");
  }



  if (user) {
    return res.status(400).send("This email is already in use.Please Login.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);


  const id = generateRandomString();
  users[id] = {
    id,
    email,
    password: hashPassword
  };


  req.session["user_id"] = id;
  res.redirect("/urls");

});



// Logout

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});



// Username Login

app.post("/login", (req, res) => {

  let email = req.body.email;
  let password = req.body.password;
  const user = getUserByEmail(email, users);

  if (!user) {
    return res.status(403).send("Email does not exist. Please register a new account.");
  }


  bcrypt.compare(password, user.password, (err, success) => {

    if (!success) {
      return res.status(403).send("Password does not match the one we have on record.Please try again.");
    }

    req.session["user_id"] = user.id;
    res.redirect("/urls");

  });


});

// Edit a long Url

app.post("/urls/:shortUrl", (req, res) => {
  const user_id = req.session["user_id"];
  const shortUrl = req.params.shortUrl;
  const url = urlDatabase[shortUrl];


  if (user_id === url.userID) {
    const longURL = req.body.longURL;
    urlDatabase[shortUrl].longURL = longURL;
    return res.redirect("/urls");
  }



  res.status(403).send("You don't have access to edit");

});



app.post("/urls/:shortURL/delete", (req, res) => {
  const user_id = req.session["user_id"];
  const url = urlDatabase[req.params.shortURL];

  if (user_id === url.userID) {
    delete urlDatabase[req.params.shortURL];
    return res.redirect("/urls");
  }


  res.status(403).send("You don't have authorization to delete");


});

// Generating a short Url

app.post("/urls", (req, res) => {
  const userID = req.session["user_id"];

  if (!isLoggedIn(userID, users)) {
    return res.status(403).send("You don't have authorization post");
  }


  let longURL = req.body.longURL;
  const shortURL = generateRandomString();


  if (longURL.slice(0, 4) !== "http") {
    longURL = `https://${longURL}`;
  }



  urlDatabase[shortURL] = { longURL: longURL, userID: userID };

  res.redirect(`/urls/${shortURL}`);
});




// Get Routes


app.get("/register", (req, res) => {

  if (isLoggedIn(req.session["user_id"], users)) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };

  res.render("urls_register", templateVars);
});




// Login Form
app.get("/login", (req, res) => {

  if (isLoggedIn(req.session["user_id"], users)) {
    res.redirect("/urls");
    return;
  }

  const templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };

  res.render("urls_login", templateVars);
});






// Generating a new URL

app.get("/urls/new", (req, res) => {
  const user_id = req.session["user_id"];
  if (!user_id) {
    return res.redirect("/register");
  }

  const templateVars = {
    user: users[req.session["user_id"]],

  };

  res.render("urls_new", templateVars);
});

//  Rendering show page

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  //if the small url does not exists
  if (!urlDatabase[shortURL] || urlDatabase[shortURL] === null) {
    res.status(302).send("The small url does not exists in the database");

  } else {
    const urlObject = urlDatabase[shortURL];
    const longURL = urlObject.longURL;
    // checking if login
    if (urlObject.userID !== req.session["user_id"]) {
      return res.send("<h1>You don't have access to this page</h1>");
    }
    const templateVars = {

      longURL,
      shortURL: req.params.shortURL,
      user: users[req.session["user_id"]]
    };


    res.render("urls_show", templateVars);
  }


});


//short Url with redirection to longURL website

app.get("/urls/", (req, res) => {
  const user_id = req.session["user_id"];

  let templateVars = {
    user: users[req.session["user_id"]],
  };

  if (!isLoggedIn(user_id, users)) {
    return res.render("urls_error");
  }


  let urls = urlsForThisUser(user_id, urlDatabase);

  templateVars = {
    user: users[req.session["user_id"]],
    urls,
  };





  res.render("urls_index", templateVars);
});




app.get("/u/:shortURL", (req, res) => {

  if (!urlDatabase[req.params.shortURL] || urlDatabase[req.params.shortURL] === null) {
    res.status(404).send("Content is not found. Page does not exist");
  }

  let url = urlDatabase[req.params.shortURL].longURL;
  if (url.slice(0, 4) !== "http") {
    url = `https://${url}`;
  }


  res.redirect(url);

});

// Root URL
app.get("/", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };

  res.render("urls_login", templateVars);
});


app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
