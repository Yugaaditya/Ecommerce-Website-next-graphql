const express = require('express');
const router = express.Router();
const productRouter=require('./productRouter')
const orderRouter=require('./orderRouter')
const cartRouter=require("./cartRouter")

router.use('/product', productRouter);
router.use('/orders', orderRouter);
router.use('/cart',cartRouter)

module.exports = router;