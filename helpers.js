


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

const urlsForThisUser = (user_id, urlDatabase) => {
  let userUrls = {};
  console.log(user_id)
  for (let key in urlDatabase) {

    if (user_id === urlDatabase[key].userID) {

      userUrls[key] = urlDatabase[key];

    }
  }
 return userUrls;
}



const isLoggedIn = (user_id, users) => {
  let userKeys = Object.keys(users);
  if (user_id === undefined || !userKeys.includes(user_id)) {
    return false;
  }
  return true;
}


module.exports = { generateRandomString, getUserByEmail, urlsForThisUser, isLoggedIn };