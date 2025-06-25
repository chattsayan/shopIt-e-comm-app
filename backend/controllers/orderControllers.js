import { log } from "console";
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
    const orders = await Order.find().sort({ createdAt: -1 });

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

      product.stock = product.stock - item?.quantity;
      await product.save({ validateBeforeSave: false });
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({ success: true, message: "Order Updated" });
  } catch (error) {
    console.error("Error while updating order: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete order
// @route  GET /api/v1/orders/:id
// @access Public
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    await order.deleteOne();

    res.status(200).json({ success: true, message: "Order Deleted", order });
  } catch (error) {
    console.error("Error while deleting order: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      // Stage 1: Filter results
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      // Stage 2: Group Data
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalAmount" },
        numOrders: { $sum: 1 },
      },
    },
  ]);

  // store sales date and num of order by date
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;

  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;

    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });

  const datesBetween = getDatesBetween(startDate, endDate);
  console.log("Dates: ", datesBetween);

  // final sales data
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));

  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// @desc   Get sales data
// @route  GET /api/v1/admin/get_sales
// @access Admin
export const getSales = async (req, res) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const { salesData, totalSales, totalNumOrders } = await getSalesData(
      startDate,
      endDate
    );

    res.status(200).json({
      totalSales,
      totalNumOrders,
      sales: salesData,
    });
  } catch (error) {
    console.error("Error fetching sales data: ", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
