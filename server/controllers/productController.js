const Product = require('../models/productModel');

const getAllProducts = async (req, res) => {

    try {
        const { sortOption, ratingOption, categoryOption, searchWord } = req.body;

        let query = {};

        let sortQuery = {};
        if (sortOption === 'priceLowToHigh') {
            sortQuery.price = 1;
        } else if (sortOption === 'priceHighToLow') {
            sortQuery.price = -1;
        }
        else if (sortOption === 'ratingHighToLow') {
            sortQuery.rating = -1
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

        res.json(products);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const getAllProductsIds = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Extract only the product IDs from the fetched products
        const productIds = products.map(product => product._id);

        res.json(productIds);
    } catch (error) {
        console.error('Error fetching product IDs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    getAllProductsIds
};