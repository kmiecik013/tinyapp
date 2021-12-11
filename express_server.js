const bodyParser = require("body-parser");
const { render } = require("ejs");
const express = require("express")
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 8080; 


app.use(cookieParser())

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");


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
const emailchecker = function(email){
  for(let id in users) {
    console.log("check id", id)
    if(users[id].email === email) {
      return users[id]
    }
  } 
  return false
}   
/*
const urlDatabase = {
  "x5672": "https://www.ign.com/ca",
  "9sm5xK": "http://www.google.com"
};*/
const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})


app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/urls.json", (reg,res) => {
  res.json(urlDatabase);
})


app.get("/urls",(req, res) => {
  const templateVars = {urls: urlDatabase, 
    user: users[req.cookies["user_id"]]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {

  const userID = req.cookies["user_id"]
  const templateVars = {urls: urlDatabase,
    user: userID
  };
  
    if(userID) {
      res.render("urls_new",templateVars);
    } else {
      res.redirect("/login")
    }
});


app.get("/urls/:shortURL", (req,res) => { 
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[req.params.shortURL]
  const templateVars ={ shortURL, longURL,
    user: req.cookies["user_id"] }
 
  res.render("urls_show", templateVars);
  

  });


app.post("/urls", (req, res) => {
  const newString = generateRandomString()
  const longURL = req.body.longURL;
   
  urlDatabase[newString] = {longURL, userID: req.cookies["user_id"]}


  res.redirect(`/urls/${newString}`)  
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");  
  res.redirect("urls")
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  

    if(!urlDatabase[shortURL]) {
      return res.send("Error, shortURL does not exist");
    }
  const longURL = urlDatabase[shortURL].longURL
  // const longURL = ...
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  //const longURL = urlDatabase[shortURL]
   delete urlDatabase[shortURL]
   //delete req.params.shortURL
  
    res.redirect("/urls")
})

app.post("/urls/:id", (req,res) => {
  const shortURL = req.params.id;
  const alphaLongULR = req.body.longURL;
  urlDatabase[shortURL].longURL  = alphaLongULR

  //console.log(urlDatabase);
  res.redirect("/urls");
});


app.post("/login", (req,res) => {


    //const email =req.body.email
    //const password = req.body.password

    const alphaUser = emailchecker(req.body.email);

    if (!req.body.email || !req.body.password) {
      return res.status(403).send("email and password cannot be blank");
    }
  
    if (!alphaUser) {
      return res.status(403).send("User with that Username  exists, please regist");
    }
  
    if (alphaUser.password !== req.body.password) {
      return res.status(403).send('password does not match');
    }
console.log("test", alphaUser);
  
  res.cookie("user_id", alphaUser.id);
  res.redirect("urls")  

})


app.post("/logout",(req,res) => {
  res.clearCookie('user_id');
  res.redirect('urls');
});

app.get("/register", (req,res) => {
  const templateVars = {urls: urlDatabase, 
    user: users[req.cookies["user_id"]]};

res.render("urls_register", templateVars)

});

app.get("/login", (req,res) => {
  const templateVars = {urls: urlDatabase, 
    user: users[req.cookies["user_id"]]}
  
    res.render("urls_login", templateVars)

})






app.post("/register", (req,res) => {

const userID = generateRandomString()

 

if (!req.body.email || !req.body.password) {
  return res.status(400).send("STATUS ERROR ; an email and password cannot be blank");
}

const alphaUser = emailchecker(req.body.email);

  if (alphaUser) {
    return res.status(400).send("Username/Email already taken");
  }

users[userID] = {
  
    id: userID,
    email: req.body.email,
    password: req.body.password,
}
  //const stringifyuser = JSON.stringify(user);
  //users[user.id] = user;

  
  res.cookie("user_id", userID);
  
  console.log(users)
  //console.log(user)
  res.redirect(`/urls`);
})





/*
app.post("urls/:shortURL",(req,res) => {
  const shortURL =req.params.shortURL
  const longURL = req.body.longURL
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls");
});
 
*/




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


/*
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL); //res stands for response
});

*/
// create a shortURL
// key = short, value = longurl
// use redirect 

function generateRandomString() {
  
    const result = Math.random().toString(36).substring(2,7);
    return  result
};


//clear cookie = 


//changed the POST in the register form by adding users to an object
//identied the route from GET post was gioing to login 
//was going to regiester = cannot post = issue with routes