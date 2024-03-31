const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.post('/remove', cartController.removeItemFromCart);

module.exports = router;
