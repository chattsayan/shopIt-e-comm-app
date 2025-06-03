import Product from "../models/Product.js";
import APIFilters from "../utils/apiFilters.js";

// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const resultsPerPage = 4;
    const apiFilters = new APIFilters(Product, req.query).search().filters();

    let products = await apiFilters.query;
    let filteredProductsCount = products.length;

    apiFilters.pagination(resultsPerPage);
    products = await apiFilters.query.clone();

    // const products = await Product.find();
    res.status(200).json({ resultsPerPage, filteredProductsCount, products });
  } catch (error) {
    console.error("Error fetching all products: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Create new product
// @route  POST /api/v1/admin/products
// @access Admin
export const newProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error creating new product: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Get single product details
// @route  GET /api/v1/products/:id
// @access Public
export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error getting product details: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   update product details
// @route  PUT /api/v1/products/:id
// @access Admin
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error updating product: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   delete product
// @route  DELETE /api/v1/products/:id
// @access Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
