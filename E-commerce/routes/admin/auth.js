const express = require('express');
const UsersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {check, validationResult} = require('express-validator')
const {requireEmail, requirePassword, requirePasswordConfir, requireEmailExists, requirePasswordExists} = require('./validators')
const {handleErrors} = require('./middlewares');

// create the web server
const router = express.Router();

// handle request and response
// req: from browser to server
// res: response from server to browser
// set a get request
router.get('/signup', (req, res) =>{
    res.send(signupTemplate({req}));
});


router.post('/signup', [
        requireEmail, 
        requirePassword, 
        requirePasswordConfir
    ], 
    handleErrors(signupTemplate),
    async (req, res) =>{
        // get access to password and email
        // on is same with addEventListener
        const {email, password} = req.body;

        // create the user
        const user = await UsersRepo.create({email, password});

        // create a cookie
        req.session.userId = user.id;
        res.redirect('/admin/products');
    }
);


router.get('/signout', (req, res) =>{
    // remove the req.session, clear the cookie
    req.session = null;

    res.send('You are logged out');
})

router.get('/signin', (req, res) =>{
    res.send(signinTemplate({}));
})

router.post('/signin', [
    requireEmailExists,
    requirePasswordExists
    ],
    handleErrors(signinTemplate), 
    async (req, res) =>{
        const { email } = req.body;

        const user = await UsersRepo.getOneBy({ email });
        req.session.userId = user.id;
        res.redirect('/admin/products');
})


module.exports = router;