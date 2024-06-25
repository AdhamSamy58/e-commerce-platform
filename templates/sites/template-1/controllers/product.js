const getProducts = (Product) => (req, res, next) => {
    Product.find()
        .then((fetchedProducts) => {
            res.status(200).json({
                message: "success",
                products: fetchedProducts,
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Fetching Products failed!",
                error: err,
            });
        });
};

const addProduct = (Product) => (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        displayQuantity: req.body.displayQuantity,
        price: req.body.price,
    });
    product
        .save()
        .then((result) => {
            res.status(201).json({
                message: "success",
                product: {
                    id: result._id,
                    ...result,
                },
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Creating product Failed!",
                error: err,
            });
        });
};

module.exports = { productController: { getProducts, addProduct } };
