# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). This app was created by Julia Tran.
It is a fully functioning app where users can register or login to  create and edit short aliases for redirection to long URLs. User's URLs are saved to their account so only users who are login can see, edit and delete. User's passwords and cookies are fully encrypted.
The TinyApp homepage includes a form where users can submit a long URL for shortening, for each URL entered, the server returns users to a form with the randomly generated shortURL. Short Urls are useful because they are easier to write down, remember and distribute. So if you are interested in making short urls try out this app, you won't be disappointed.

## Final Product

!["screenshot description"]https://github.com/Juliaxtran/tinyapp/blob/main/screenshots/homepage.png?raw=true
!["screenshot description"]https://github.com/Juliaxtran/tinyapp/blob/main/screenshots/editpage.png?raw=true
!["screenshot description"]https://github.com/Juliaxtran/tinyapp/blob/main/screenshots/newpage.png
!["screenshot description"]https://github.com/Juliaxtran/tinyapp/blob/main/screenshots/registerpage.png?raw=true

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session


## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.
