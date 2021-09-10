const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductRouter = require('./routes/admin/product');
const productRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');



// create the web server
const app = express();
// apply all middleware functions to all request handlers
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
    // encrypt the userID
    keys: ['fergsdfgsdf2354ygsdfq245']
}))

// connect the subrouter to the server
app.use(authRouter);
app.use(adminProductRouter);
app.use(productRouter);
app.use(cartsRouter);

// listen request from browser
// port number, callback function
// visit at localhost:3000
app.listen(3000, ()=>{
    console.log('listening');
})