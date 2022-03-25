



const generateRandomString = () => {
  let randomString = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  for (let i = 0; i < 6; i++) {
    randomString += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomString;
};



const getUserByEmail = (email, users) => {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
    
      return user;
    }
  }
  return null;
};

const urlsForUser = (id) => {
  const urlsForThisUser = {};
  for (const key in urlDatabase) {
    if (id === urlDatabase[key]["userID"]) {
      urlsForThisUser[key] = urlDatabase[key].longURL;

    }
  }
  return urlsForThisUser;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser};