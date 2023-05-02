// Import express.js
const express = require("express");
const path = require('path')
const logger = require('morgan') //? to  log requests coming from browser/client in terminal
const helmet = require("helmet"); //?Using helmet can help improve the security of your application with minimal effort.   protect your app against common web vulnerabilities, such as XSS and CSRF attacks.
const cors = require('cors') //? to enable Cross-Origin Resource Sharing (CORS) in your Express app.
const compression = require('compression') //? to compress the size of data before sending as response to client. resulting in faster page load times and reduced bandwidth costs.


// Create express app
const app = express();

// Set the Content Security Policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
    styleSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
    fontSrc: ["'self'", 'cdn.jsdelivr.net'],
    imgSrc: ["'self'", 'www.google-analytics.com', 'ssl.gstatic.com']
  }
}));
app.use(cors())
app.use(logger('dev'))
app.use(express.json()) //very important middleware to parse JSON . Without this backend wont be able to process the incoming data from front end such as username, password etc
app.use(express.urlencoded({ extended: true })) // same as above but with form data 
app.use(compression())


// Add static files location
app.use(express.static(path.join(__dirname, 'static'))); //tells Node.js that we store the static assets like js, css  in a directory named static.

app.set('views', path.join(__dirname, 'views')) //?we tell Node.js what the source of our templates is. Now, Node.js knows where to look for our pug templates.
app.set('view engine', 'ejs')  //? telling NodeJs what engine to use to render the template. In our case PUG.

// Get the functions in the db.js file to use
const db = require('./services/db');



// routeHandler 
app.use('/', require('./routes')) // seperating all routing related code in seperate file called routes/index.js ..
// ?Modular coding technique :- it avoids overcrowding of codes in same file. Also improves specificity of a file ie: what that particular file is all about.
//?app.js file is used only to initiate and run our backend server at port 3400 along with some npm packages (these npm packages must activae when server starts. so using it in app.js file) for web requirements


// Start server on port 3000
app.listen(3000, function () {
  console.log(`Server running at http://127.0.0.1:3000/`);
});