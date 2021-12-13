////------HELPER FUNCTIONS------//////

////------CREATES NEW STRING----/////
function generateRandomString() {
  
  const result = Math.random().toString(36).substring(2,8);
  return  result;
};

//////----FIND USER BY CHECKING EMAIL///////
const emailchecker = function(email,users){
  for(let id in users) {
    console.log("check id", id)
    if(users[id].email === email) {
      return users[id];
    }
  } 
  return false
}

/////// ---- CHECKS URLS FOR SPECIFIC USER----//////
const urlsForUser = function(id,database) {
  const output = {}
  for(let key in database) {
    const urlObj = database[key]
    if (urlObj.userID === id) {
      output[key] = urlObj; 
    }
  }
    return output;
}

module.exports = { generateRandomString, emailchecker, urlsForUser };
