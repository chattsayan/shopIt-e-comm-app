import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {
  applySearch,
  applyFilters,
  applyPagination,
} from "../utils/apiFilters.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
export const getProducts = async (req, res) => {
  try {
    const resultsPerPage = 4;

    let query = Product.find();
    query = applySearch(query, req.query);
    query = applyFilters(query, req.query);

    // Get total count before pagination
    const filteredProductsCount = await query.clone().countDocuments();

    // Apply pagination after getting count
    query = applyPagination(query, req.query, resultsPerPage);
    const products = await query;

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
    req.body.user = req.user._id;
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

// @desc   Get products
// @route  GET /api/v1/products
// @access Admin
export const getAdminProducts = async (req, res) => {
  try {
    const product = await Product.find();

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

// @desc   Get single product details
// @route  GET /api/v1/products/:id
// @access Public
export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req?.params?.id).populate(
      "reviews.user"
    );

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

// @desc   upload product images
// @route  PUT /api/v1/admin/products/:id/upload_images
// @access Admin
export const uploadProductImages = async (req, res) => {
  try {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const uploader = async (image) => upload_file(image, "shopIT/products");

    const urls = await Promise.all((req?.body?.images).map(uploader));

    product?.images?.push(...urls);

    if (!product.user && req.user && req.user._id) {
      product.user = req.user._id;
    }

    await product?.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error uploading product images: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   delete product images
// @route  PUT /api/v1/admin/products/:id/delete_image
// @access Admin
export const deleteProductImage = async (req, res) => {
  try {
    let product = await Product.findById(req?.params?.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const isDeleted = await delete_file(req.body.imgId);

    if (isDeleted) {
      product.images = product?.images?.filter(
        (img) => img.public_id !== req.body.imgId
      );

      await product?.save();
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error deleting product image: ", error);
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

    // deleting image associated with product
    for (let i = 0; i < product?.images?.length; i++) {
      await delete_file(product?.images[i].public_id);
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

// @desc   create/update product review
// @route  PUT /api/v1/reviews
// @access Public
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req?.user?._id,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Initialize reviews array if it doesn't exist
    // if (!product.reviews) {
    //   product.reviews = [];
    // }

    const isReviewed = product?.reviews?.find(
      (r) => r.user.toString() === req?.user?._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review?.user?.toString() === req?.user?._id.toString()) {
          review.comment = comment;
          review.rating = Number(rating);
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: isReviewed
        ? "Review updated successfully"
        : "Review added successfully",
    });
  } catch (error) {
    console.error("Error while creating/updating product review: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   get all reviews
// @route  GET /api/v1/reviews
// @access Public
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.query.id).populate(
      "reviews.user"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error("Error while getting product reviews: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   delete product review
// @route  DELETE /api/v1/admin/reviews
// @access Admin
export const deleteReview = async (req, res) => {
  try {
    const { productId, id } = req.query;

    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const reviews = product?.reviews?.filter(
      (review) => review._id.toString() !== id.toString()
    );

    // Update number of reviews
    const numOfReviews = reviews.length;

    // Update average rating using the filtered reviews array
    const ratings =
      numOfReviews === 0
        ? 0
        : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    product = await Product.findByIdAndUpdate(
      productId,
      { reviews, numOfReviews, ratings },
      { new: true }
    );

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully", product });
  } catch (error) {
    console.error("Error while deleting review: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   can user review
// @route  GET /api/v1/can_review
// @access Public
export const canUserReview = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      "orderItems.product": req.query.productId,
    });

    if (orders.length === 0) {
      return res.status(200).json({ canReview: false });
    }

    res.status(200).json({ canReview: true });
  } catch (error) {
    console.error("Error checking if user can review: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
