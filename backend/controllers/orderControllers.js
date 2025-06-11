import Order from "../models/Order.js";
import Product from "../models/Product.js";

// @desc   Create new order
// @route  POST /api/v1/orders/new
// @access Public
export const newOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
    } = req.body;

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount,
      shippingAmount,
      totalAmount,
      paymentMethod,
      paymentInfo,
      user: req.user._id,
    });

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error creating new order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Get current user orders
// @route  GET /api/v1/me/orders
// @access Public
export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching current user order details: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Get order details
// @route  GET /api/v1/orders/:id
// @access Public
export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Error getting order details: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc   Get all orders
// @route  GET /api/v1/admin/orders
// @access Admin
export const allOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    res
      .status(200)
      .json({ success: true, message: "Fetched all orders", orders });
  } catch (error) {
    console.error("Error while fetching all orders: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update order
// @route  GET /api/v1/products/:id
// @access Admin
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    if (order?.orderStatus === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "You have already delivered this order",
      });
    }

    //   update products stock
    order?.orderItems?.forEach(async (item) => {
      const product = await Product.findById(item?.product?.toString());

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "No Product found with this ID",
        });
      }

      product.stock = product.stock - quantity;
      await product.save();
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    res.status(200).json({ success: true, message: "Fetched all orders" });
  } catch (error) {
    console.error("Error while fetching all orders: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
