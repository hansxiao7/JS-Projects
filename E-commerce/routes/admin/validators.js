const {check} = require('express-validator');
const UsersRepo = require('../../repositories/users');

module.exports =  {
    requireEmail: 
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must be a valid email')
            .custom(async (email) =>{
                const existingUser = await UsersRepo.getOneBy({email});
                if (existingUser){
                    // has already signed up
                    throw new Error('Email in use');
                }
            }),
    requirePassword:
        check('password')
            .trim()
            .isLength({min:4, max:20})
            .withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfir:
        check('passwordConfirmation')
            .trim()
            .isLength({min:4, max:20})
            .withMessage('Must be between 4 and 20 characters')
            .custom((passwordConfirmation, {req}) =>{
                if (passwordConfirmation !== req.body.password){
                    throw new Error('Password does not match');
                }
            }),
    requireEmailExists: 
        check('email')
            .trim()
            .normalizeEmail()
            .isEmail()
            .withMessage('Must be a valid email')
            .custom(async (email) =>{
                const user = await UsersRepo.getOneBy({email});
                if (!user){
                    throw new Error('Email not found');
                };

                return true;
            }),
    requirePasswordExists:
        check('password')
            .trim()
            .custom(async (password, {req}) =>{
                const user = await UsersRepo.getOneBy({email: req.body.email});
                if (!user) throw new Error('Incorrect password!')
                const compareResult = await UsersRepo.comparePasswords(user.password, password);
                if (!compareResult){
                    throw new Error('Incorrect password!')
                }
            }),
    requireTitle:
        check('title')
            .trim()
            .isLength({min:5, max:40})
            .withMessage('Must be between 5 and 40 characters'),
    requirePrice:
        check('price')
            .trim()
            .toFloat()
            .isFloat({min:1})
            .withMessage('Must be a number greater than 1'),
    requireImage: 
        check('image')
            .custom((image, { req }) => {
                const file = req.file;
                if (!file) {
                    throw new Error('Please upload file');
                }
                return true;
            })
}