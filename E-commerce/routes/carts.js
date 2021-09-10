const express = require('express');
const cartsRepo = require('../repositories/carts');
const productsRepo = require('../repositories/products');
const cartShowTemplate = require('../views/carts/show');

const router = express.Router();

router.post('/cart/products', async (req, res) =>{
    // use cookie
    let cart;
    if (!req.session.cartId){
        // create a new cart
        cart = await cartsRepo.create({items:[]});
        req.session.cartId = cart.id;
    } else {
        cart = await cartsRepo.getOne(req.session.cartId);
    }
    // req.body.productId
    const existingIterm = cart.items.find(item => item.id === req.body.productId);

    if (existingIterm) {
        existingIterm.quantity++;
    } else {
        cart.items.push({id:req.body.productId, quantity:1});
    }

    await cartsRepo.update(cart.id, {
        items:cart.items
    })
    res.redirect('/cart');
})

router.get('/cart', async (req, res) => {

    if (!req.session.cartId){
        // create a new cart
        res.redirect('/');
    }
    
    const cart = await cartsRepo.getOne(req.session.cartId);
    for (let item of cart.items){
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }

    res.send(cartShowTemplate({items: cart.items}));
})

router.post('/cart/delete/:productId', 
    async (req, res) =>{
        const cart = await cartsRepo.getOne(req.session.cartId);
        
        const items = cart.items.filter((item) => item.id !== req.params.productId);

        await cartsRepo.update(req.session.cartId, {items});
        res.redirect('/cart');
    })

module.exports = router;