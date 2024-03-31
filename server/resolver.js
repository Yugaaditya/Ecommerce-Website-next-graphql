const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');
const Cart = require('./models/cartModel');
const Product = require("./models/productModel")
const Order = require("./models/orderModel")

const resolver = {
    Mutation: {
        login: async (_, { email, password },context) => {
            try {
                const user = await User.findOne({ email });

                if (!user) {
                    const hashedPassword = await bcrypt.hash(password, 8);
                    const newUser = new User({ email, password: hashedPassword });
                    const newCart = new Cart({ user: newUser._id })
                    await newCart.save();
                    newUser.cart = newCart._id;
                    await newUser.save();
                    const token = jwt.sign({ _id: newUser._id }, process.env.JWT_PASS, {
                        expiresIn: "1h"
                    })

                    return {
                        status: 200,
                        message: 'User registration successful!',
                        token
                    };
                }

                const isPasswordMatch = await bcrypt.compare(password, user.password);

                if (!isPasswordMatch) {
                    return {
                        status: 401,
                        message: 'Incorrect password',
                        token: null
                    };
                }

                const token = jwt.sign({ _id: user._id }, process.env.JWT_PASS, {
                    expiresIn: '1h'
                });

                return {
                    status: 200,
                    message: 'Login successful',
                    token
                };
            } catch (error) {
                console.error('Error in login:', error);
                return {
                    status: 500,
                    message: 'Internal server error',
                    token: null
                };
            }
        },
        addItemToCart: async (_, { productId },context) => {
            try {
                if (context.userId==="Invalid Token"){
                    return {
                        status:400
                    }
                }
                const userId=context.userId
                const cart = await Cart.findOne({ user: userId })
                const product = await Product.findById(productId);
                if (!product) {
                    return { status: 404, message: 'Product does not exist' };
                }
                if (cart.products.findIndex(item => item.product.toString() === productId) !== -1) {
                    return { status: 200, message: 'Product already exist in cart' };
                }

                cart.products.push({ product: productId });
                await cart.save();
                return { status: 200, message: 'Product added to cart successfully' };

            } catch (error) {
                console.error('Error adding product to cart:', error);
                return { status: 500, message: 'Internal server error' };
            }
        },
        removeItemFromCart: async (_, {productId },context) => {
            try {
                if (context.userId==="Invalid Token"){
                    return {
                        status:400
                    }
                }
                const userId=context.userId
                const cart = await Cart.findOne({ user: userId })
                const product = await Product.findById(productId);
                if (!product) {
                    return { status: 404, message: 'Product does not exist' };
                }

                if (cart.products.findIndex(item => item.product.toString() === productId) !== -1) {
                    cart.products = cart.products.filter(id => id.product.toString() !== productId);
                    await cart.save();
                    return { status: 200, message: 'Product removed from cart successfully' };
                }
                else {
                    return { status: 404, message: 'Product not found in cart' };
                }

            } catch (error) {
                console.error('Error removing product from cart:', error);
                return { status: 500, message: 'Internal server error' };
            }
        },
        addOrder:async(_,{totalAmount},context)=>{
            try {
                if (context.userId==="Invalid Token"){
                    return {
                        status:400
                    }
                }
                const userId=context.userId
                const cart = await Cart.findOne({ user: userId })
                const user = await User.findById(userId);
        
                if (!user) {
                    return { status: 404, message: 'User not found' };
                }
        
                const products = cart.products.map(item=>item.product);
                cart.products = [];
        
                const order = new Order({
                    user: userId,
                    products: products,
                    totalAmount: totalAmount
                });
        
                const savedOrder = await order.save();
                user.orders.push(savedOrder._id);
                await cart.save();
                return { status: 201, message: 'Order added successfully' };
                //res.status(201).json({ message: 'Order added successfully', order: savedOrder });
            } catch (error) {
                console.error('Error adding order:', error);
                return { status: 500, message: 'Internal server error' };
            }
        }
    },
    Query: {
        Products: async (_, { sortOption, ratingOption, categoryOption, searchWord },context) => {
            try {
                let query = {};
                let sortQuery = {};
                if (sortOption === 'priceLowToHigh') {
                    sortQuery.price = 1;
                } else if (sortOption === 'priceHighToLow') {
                    sortQuery.price = -1;
                } else if (sortOption === 'ratingHighToLow') {
                    sortQuery.rating = -1;
                }

                if (ratingOption) {
                    query.rating = { $gte: ratingOption, $lte: ratingOption + 1 };
                }

                if (categoryOption) {
                    query.category = categoryOption;
                }

                if (searchWord) {
                    query.$or = [
                        { name: { $regex: searchWord, $options: 'i' } },
                        { description: { $regex: searchWord, $options: 'i' } }
                    ];
                }
                const products = await Product.find(query).sort(sortQuery);
                return products;

            } catch (error) {
                console.error('Error fetching products:', error);
                throw new Error('Internal server error');
            }
        },
        Product: async (_, { id },context) => {
            try {
                const product = await Product.findById(id);
                if (!product) {
                    return res.status(404).json({ error: 'Product not found' });
                }
                return product;
            } catch (error) {
                console.error('Error fetching product:', error);
                throw new Error('Internal server error');
            }
        },
        ProductIds: async (_,__,context) => {
            try {
                // Fetch all products from the database
                const products = await Product.find();

                // Extract only the product IDs from the fetched products
                const productIds = products.map(product => product._id);

                return productIds;
            } catch (error) {
                console.error('Error fetching product IDs:', error);
                throw new Error('Internal server error');
            }
        },
        Cart: async (_, __, context) => {
            try {
                if (context.userId==="Invalid Token"){
                    return [{
                        status:400
                    }]
                }
                const userId=context.userId
                const cart = await Cart.findOne({ user: userId }).populate('products.product')
                const cartItems = cart.products.map(element => ({
                    status:201,
                    _id: element.product._id,
                    image: element.product.image,
                    name: element.product.name,
                    category: element.product.category,
                    description: element.product.description,
                    price: element.product.price,
                    rating: element.product.rating
                }));
                return cartItems
            } catch (error) {

                console.error('Error fetching user cart:', error);
                throw new Error('Internal server error');
            }
        },
        Order: async (_, __, context) => {
            try {
                if (context.userId==="Invalid Token"){
                    return [{
                        status:400
                    }]
                }
                const userId=context.userId
                let orders = await Order.find({ user: userId }).populate('products');
                orders = orders.map(order => ({
                    ...order.toObject(),
                    status:201,
                    products: order.products.map(product => ({
                        _id: product._id,
                        image: product.image,
                        name: product.name,
                        category: product.category,
                        description: product.description,
                        price: product.price,
                        rating: product.rating
                    }))
                }));
                return orders;
            } catch (error) {
                console.error('Error fetching orders:', error);
                throw new Error('Internal server error');
            }
        }
    },
    Order:{
        products(parent){
            return parent.products
        }
    }
};

module.exports = resolver;