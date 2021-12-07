const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

function generateRandomString() {

};


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
})

app.set("view engine", "ejs");

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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase};
  res.render("urls_show", templateVars);
  console.log("ign.com")
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("I hope this works");         // Respond with 'Ok' (we will replace this)
});
