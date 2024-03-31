const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', orderController.getOrdersByUserId);
router.post('/add', orderController.addOrder);

module.exports = router;
