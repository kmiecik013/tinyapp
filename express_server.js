////-----REQUIRES------//////

const bodyParser = require("body-parser");
const { render } = require("ejs");
const express = require("express");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
const { generateRandomString, emailchecker, urlsForUser } = require("./helpers");

//////----SERVER-----///
const app = express();
const PORT = 8080; 

////------MIDDLEWARE-----/////
app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(
  cookieSession({
    name: "session",
    keys: ["cookie", "session"],
  })
);

////-----LISTEN to PORT -----/////
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

/////-----USER DATABASE-----/////
const users ={
  "userRandomID":{
    id: "userRandomID" ,
    email: "user@example.com",
    password: "sure"
  },

  "userRandomID2" :{
    id: "userRandomID2",
    email: "user2@example.com",
    password : "yes2"
  }
}
/////-----URLS DATABASE----////
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  },
  hshdi: {
    longURL: "https://www.facebook.com",
    userID: "bgkfl"
}

};

/////----INITIAL GET----//////
app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

////// ----- GET HOME/----////////
app.get("/", (req, res) => {
  const userID = req.session["user_id"];
  if(!userID) {
  res.redirect("/login");
}
  res.redirect("/urls");
});

//////----- GET URLS JSON-----/////
app.get("/urls.json", (reg,res) => {
  res.json(urlDatabase);
})

/////------GET URLS PAGE-----//////
app.get("/urls",(req, res) => {

  const userID = req.session["user_id"];
  const userUrl = urlsForUser(userID, urlDatabase);
  const templateVars = {urls: userUrl, 
    user: users[userID]};
  
  if (!userID) {
    res.status(403).send(`Please login to access/delete/edit URLS <a href="/login">Log Into Your Account </a>`);
  }

  res.render("urls_index", templateVars);
});

//////-------GET CREATE URLS------//////
app.get("/urls/new", (req, res) => {

  const userID = req.session["user_id"];
  const templateVars = {urls: urlDatabase,
    user: userID
  };
  
    if(userID) {
      res.render("urls_new",templateVars);
    } else {
      res.redirect("/login");
    }
});

//////-----GEt URLS EDIT -----////
app.get("/urls/:shortURL", (req,res) => { 

  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL];
  const templateVars ={ shortURL, longURL,
    user: userID }
    
  if(longURL.userID !== userID) {
    return res.status(403).send("Url does not belong to you ");
  }

    res.render("urls_show", templateVars);
  });

///////-----POST URLS PAGE----//////
app.post("/urls", (req, res) => {
  const newString = generateRandomString();
  const longURL = req.body.longURL;
   
  urlDatabase[newString] = {longURL, userID: req.session["user_id"]}

  res.redirect(`/urls/${newString}`);  
  res.redirect("urls");
});

////-----GET SHORTURL------////
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  
    if(!urlDatabase[shortURL]) {
      return res.send("Error, shortURL does not exist");
    }
  const longURL = urlDatabase[shortURL].longURL
  
  res.redirect(longURL);
});


///////------DELETE POST------//////
app.post('/urls/:shortURL/delete', (req, res) => {

  const userID = req.session["user_id"];
  const shortURL = req.params.shortURL;

  if(urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("Url does not belong to you ")
  }
   delete urlDatabase[shortURL]
  
    res.redirect("/urls");
})

///////-----ID UPDATE &------///////
app.post("/urls/:id", (req,res) => {
  const userID = req.session["user_id"];
  const shortURL = req.params.id;
  const alphaLongULR = req.body.longURL;

  if(urlDatabase[shortURL].userID !== userID) {
    return res.status(403).send("Url does not belong to you ");
  }
urlDatabase[shortURL].longURL  = alphaLongULR

  res.redirect("/urls");
});


////// ----LOGIN GET-----/////
app.get("/login", (req,res) => {
  const userID = req.session["user_id"];
    
  if(!userID) {
    
      const templateVars = {urls: urlDatabase, 
      user: users[req.session["user_id"]]}
      res.render("urls_login", templateVars)

  } else {
      res.redirect("/urls");
  }
})



////----REGISTRATION GET-----////
app.get("/register", (req,res) => {

  const userID = req.session["user_id"];
    if (!userID) {

  const templateVars = {urls: urlDatabase, 
    user: users[req.session["user_id"]]};
      res.render("urls_register", templateVars)
   
    } else {
     res.redirect("/urls");
   }
  
});

//////-----LOGIN POST------///////
app.post("/login", (req,res) => {

  const email = req.body.email
  const password = req.body.password; 
  const matchedUser = emailchecker(email,users);

    if (!email || !password) {
      return res.status(403).send(`email and password cannot be blank <a href="/login">Log In </a>`);
    }
    if (!matchedUser) {
      return res.status(403).send(`User does not exist <a href="/login">Log In </a>`
      );
    }
    if (!bcrypt.compareSync(password ,matchedUser.password)) {
      return res.status(403).send(`password does not match <a href="/login">Log In </a>`)
    }

      req.session["user_id"] = matchedUser.id ;
      res.redirect("/urls")  

})


/////-------REGISTER POST-----/////
app.post("/register", (req,res) => {

  const email =req.body.email;
  const userID = generateRandomString();
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    if (!email || !hashedPassword) {
    return res.status(400).send(`STATUS ERROR ; an email and password cannot be blank. <a href="/login">Log Into Your Account </a>`);
    } 

  const alphaUser = emailchecker(email,users);

    if (alphaUser) {
    return res.status(400).send(`Username/Email already taken<a href="/login">Log Into Your Account </a>`);
    }

users[userID] = {
  
    id: userID,
    email: req.body.email,
    password: hashedPassword,
}
  
    req.session["user_id"] = userID;
    res.redirect(`/urls`);  
})


/////----LOGOUT POST-----//////
app.post("/logout",(req,res) => {
    req.session = null;
    res.redirect('urls');
});


////////-------NOTES-----////////
