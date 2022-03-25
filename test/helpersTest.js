const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

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

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert.equal(user.id, expectedUserID);
  });

  it('should return null if email passed is not in users database', function() {
    const user = getUserByEmail("user3@example.com", testUsers);
    const expectedUserID = null;
    assert.equal(user, expectedUserID);
  });

  it('should return the right password if email passed is in users database', function() {
    const user = getUserByEmail("user2@example.com", testUsers);
    const expectedUserID = "dishwasher-funk";
    assert.equal(user.password, expectedUserID);
  });

});

