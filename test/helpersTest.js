const { assert } = require('chai');

const { emailchecker, urlsForUser, generateRandomString } = require('../helpers.js');

const testUsers = {
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

describe('emailchecker', function() {
  it('should return a user with valid email', function() {
    const user = emailchecker("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should not return with valid email', function() {
    const user = emailchecker("kmiecik@example.com", testUsers);
    const expectedUserID = "user@example.com";
    assert.notEqual(user.id, expectedUserID);
  });

  it('should return with undefined', function() {
  const user = emailchecker("user@example.com", testUsers);
  const expectedUserID = false;
  assert.notEqual(user, expectedUserID);
  })

});

describe("generateRandomString", function() {

  it("should return a random string (userID) with 6 characters",function() {
    const userID = generateRandomString().length;
    const expectedOutput = 6;
    assert.equal(userID, expectedOutput);
  });
  
  it("should not return a string", function() {
    const userID = generateRandomString();
    const expectedOutput = false;
    assert.notEqual(userID, expectedOutput);  
  });
});





