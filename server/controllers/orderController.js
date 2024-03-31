const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel')

const addOrder = async (req, res) => {
    try {
        const  userId  = req.userId;

        const cart = await Cart.findOne({ user: userId })
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const products = cart.products.map(item=>item.product);
        cart.products = [];
        const { totalAmount } = req.body;

        const order = new Order({
            user: userId,
            products: products,
            totalAmount: totalAmount
        });

        const savedOrder = await order.save();
        user.orders.push(savedOrder._id);
        await cart.save();
        res.status(201).json({ message: 'Order added successfully', order: savedOrder });
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const getOrdersByUserId = async (req, res) => {
    const  userId  = req.userId;

    try {
        let orders = await Order.find({ user: userId }).populate('products');
        orders= orders.map(order => ({
            ...order.toObject(),
            products:order.products.map(product => ({
            _id: products._id,
            image: product.image,
            name: product.name,
            category: product.category,
            description: product.description,
            price: product.price,}))
        }));
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    addOrder,
    getOrdersByUserId
};