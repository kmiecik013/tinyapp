const bodyParser = require("body-parser");
const express = require("express")

const app = express();
const PORT = 8080; // default port 8080



app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})



const urlDatabase = {
  "x5672": "https://www.ign.com/ca",
  "9sm5xK": "http://www.google.com"
};



app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (reg,res) => {
  res.json(urlDatabase);
})



app.get("/urls",(req, res) => {
  const templateVars = {urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
 
});




app.post("/urls", (req, res) => {
  const newString = generateRandomString()
  const longURL = req.body.longURL;
   
  urlDatabase[`${newString}`] = `${longURL}` 
  res.redirect(`/urls/${newString}`)  
  console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");  
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
  // const longURL = ...
  res.redirect(longURL);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL]
   delete urlDatabase[shortURL]
   delete req.params.shortURL
  
    res.redirect("/urls")
})



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
