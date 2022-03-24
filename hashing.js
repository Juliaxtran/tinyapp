// npm i bcryptjs
// const bcrypt = require('bcryptjs');

// //How to has password
// const salt =  bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync(plainTestPassword, salt);
// const success = bcrypt.compareSync('password', hash);

// // Login 
// // hashing algorithm is a one way algorithm 


// bcrypt.compare('password', hash, (err, success)=> {
//   console.log("was this succesful", hash)
// })

// // hashing password Async Way 
// // bcrypt.genSalt(10, (err, salt) => {
// // bcrypt.hash(password, salt, (err, hash)=>{
// //   const id = generateRandomString();
// //   users[id] = { 
// // id, 
// // email, 
// // password : hash };
// //   res.cookie("user_id", id);
// //   res.redirect("/urls");
// // })
// // })

// // we need to encrpypt our cookies // encrpyt cookie
// // const cookieSession = require("cookie-session")
// // app.use(cookieSession({
// //   name: "session",
// //   keys: ['key1,'key2']
// // }));

// //Destroy  a cookie
// // req.session = null;

// // will create new encrypted cookie 
//   // req.session[user_id] = user.id;


// // will create new encrypted cookie 
//   // req.session[user_id] = user.id;

