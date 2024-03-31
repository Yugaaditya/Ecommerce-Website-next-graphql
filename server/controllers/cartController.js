const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require("../models/cartModel")

const getCart = async (req, res) => {
    try {
        const userId = req.userId;

        const cart = await Cart.findOne({ user: userId }).populate('products.product')
        // console.log(2)
        // if (!cart) {
        //     return res.status(404).json({ message: 'User not found' });
        // }

        const cartItems = cart.products.map(element => ({
            _id: element.product._id,
            image: element.product.image,
            name: element.product.name, 
            category: element.product.category,
            description: element.product.description,
            price: element.product.price,
        }));
        res.status(200).json(cartItems);
    } catch (error) {
        console.error('Error fetching user cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const addItemToCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId })
        // const user = await User.findById(userId);
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product does not exist' });
        }
        if (cart.products.findIndex(item => item.product.toString() === productId) !== -1) {
            return res.status(200).json({ message: 'Product already exist in cart' });
        }

        cart.products.push({ product: productId });
        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully' });

    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const removeItemFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: userId })
        // if (!user) {
        //     return res.status(404).json({ message: 'User not found' });
        // }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product does not exist' });
        }

        if (cart.products.findIndex(item => item.product.toString() === productId) !== -1) {
            cart.products = cart.products.filter(id => id.product.toString() !== productId);
            await cart.save();
            res.status(200).json({ message: 'Product removed from cart successfully' });
        }
        else {
            res.status(404).json({ message: 'Product not found' });
        }

    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    getCart,
    addItemToCart,
    removeItemFromCart
};
