const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs")
const cookieSession = require("cookie-session")
const req = require("express/lib/request");
const app = express();
const PORT = 4000; // default port 8080


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


const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};



const getUserByEmail = (email) => {

  for (const user in users) {

    if (email === users[user].email) {
      return users[user];
    }
  }
  return null;
};



const urlsForUser = (id) => {
  const urlsForThisUser = {}
  for (const key in urlDatabase) {
    if (id === urlDatabase[key]["userID"]) {
      urlsForThisUser[key] = urlDatabase[key].longURL

    }
  }
  return urlsForThisUser;
}






// Post Registeration Form

app.post("/register", (req, res) => {


  const { email, password } = req.body;
  const user = getUserByEmail(email);

  if (user) {
    return res.status(400).send("This Email is already in use.Please Login.");
  }

  const salt =  bcrypt.genSaltSync(10);
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



 


app.get("/register", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };

  res.render("urls_register", templateVars);
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
  const user = getUserByEmail(email);

  if (!user) {
    return res.status(403).send("Email does not exist. Please register a new account.");
  }


  bcrypt.compare(password, user.password,(err, success)=>{
  
    if(!success){
      return res.status(403).send("Password does not match the one we have on record.Please try again.");
    }

    req.session["user_id"] = user.id;
    res.redirect("/urls");

  })


});



// Login Form
app.get("/login", (req, res) => {

  const templateVars = {
    urls: urlDatabase,
    user: users[req.session["user_id"]]
  };

  res.render("urls_login", templateVars);
});




// Edit a long Url 

app.post("/urls/:shortUrl", (req, res) => {
  const user_id = req.session["user_id"];
  const url = urlDatabase[req.params.shortURL]

  if (user_id === url.userID) {
    const shortURL = req.params.shortUrl;
    const longURL = req.body.longURL;
    urlDatabase[shortURL].longURL = longURL;
    return res.redirect("/urls")
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
  let longURL = req.body.longURL;
  const shortURL = generateRandomString();

  if (!longURL.includes("http")) {
    longURL = "https://" + longURL;
  }

  urlDatabase[shortURL] = { longURL: longURL, userID: userID }

  res.redirect(`/urls/${shortURL}`);
});

// Generating a new URL

app.get("/urls/new", (req, res) => {
  const user_id = req.session["user_id"];
  if (!user_id) {
    return res.redirect("/register")
  }


  const templateVars = {
    user: users[req.session["user_id"]],

  };

  res.render("urls_new", templateVars);
});

//  Rendering show page

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlObject = urlDatabase[shortURL];
  const longURL = urlObject.longURL;
  if (urlObject.userID !== req.session["user_id"]) {
    return res.send("<h1>You don't have access to this page</h1>");
  }
  const templateVars = {

    longURL,
    shortURL: req.params.shortURL,
    user: users[req.session["user_id"]]
  };


  res.render("urls_show", templateVars);

});


//  short Url with redirection to longURL website 

app.get("/urls/", (req, res) => {
  const user_id = req.session["user_id"];


  const urlsForThisUser = {}
  for (let key in urlDatabase) {

    if (user_id === urlDatabase[key].userID) {

      urlsForThisUser[key] = urlDatabase[key]

    }
  }

  const templateVars = {
    user: users[req.session["user_id"]],
    urls: urlsForThisUser,
  };
  console.log(templateVars);
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




