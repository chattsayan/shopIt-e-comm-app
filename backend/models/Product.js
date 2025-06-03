import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Product Name"],
      maxLength: [200, "Product Name cannot exceed 200 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter Product Price"],
      maxLength: [5, "Price cannot exceed 5 digits"],
    },
    description: {
      type: String,
      required: [true, "Please Enter Product Description"],
    },
    ratings: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    category: {
      type: String,
      required: [true, "Please Enter Product Category"],
      enum: {
        values: [
          "Electronics",
          "Cameras",
          "Laptops",
          "Accessories",
          "Headphones",
          "Food",
          "Books",
          "Sports",
          "Outdoor",
          "Home",
        ],
        message: "Please select correct category for product",
      },
    },
    seller: {
      type: String,
      required: [true, "Please Enter Product Seller"],
    },
    stock: {
      type: Number,
      required: [true, "Please Enter Product Stock"],
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // true
      },
      rating: {
        type: Number,
        required: false, // true
      },
      comment: {
        type: String,
        required: false, // true
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // true
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
