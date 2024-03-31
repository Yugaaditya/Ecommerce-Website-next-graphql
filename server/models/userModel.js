const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
