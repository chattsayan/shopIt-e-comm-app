import Stripe from "stripe";
import Order from "../models/Order.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc   Create Stripe Checkout session
// @route  POST /api/v1/payment/checkout_session
// @access Public
export const stripeCheckoutSession = async (req, res) => {
  try {
    const body = req?.body;

    const line_items = body?.orderItems?.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item?.name,
            images: [item?.image],
            metadata: { productId: item?.product },
          },
          unit_amount: item?.price * 100,
        },
        tax_rates: [process.env.TAX_RATE],
        quantity: item?.quantity,
      };
    });

    const shippingInfo = body?.shippingInfo;

    const shipping_rate =
      body?.itemsPrice >= 200
        ? process.env.FREE_SHIPPING
        : process.env.CHARGED_SHIPPING;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/me/orders`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      customer_email: req?.user?.email,
      client_reference_id: req?.user?._id?.toString(),
      mode: "payment",
      metadata: { ...shippingInfo, itemsPrice: body?.itemsPrice },
      shipping_options: [{ shipping_rate }],
      line_items,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderItems = async (line_items) => {
  return new Promise((resolve, reject) => {
    let cartItems = [];

    line_items?.data?.forEach(async (item) => {
      const product = await stripe.products.retrieve(item?.price?.product);
      const productId = product.metadata.productId;

      console.log("item", item);
      console.log("product", product);

      cartItems.push({
        product: productId,
        name: product.name,
        price: item?.price?.unit_amount_decimal / 100,
        quantity: item?.quantity,
        image: product.images[0],
      });

      if (cartItems.length === line_items?.data?.length) {
        resolve(cartItems);
      }
    });
  });
};

// @desc   Create new order after payment
// @route  POST /api/v1/payment/webhook
// @access Public
export const stripeWebhook = async (req, res) => {
  try {
    // console.log("Webhook endpoint hit");
    const sig = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log("Event constructed:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;

      const itemsPrice = Number(session.metadata.itemsPrice);
      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      // const itemsPrice = session.total_details.itemsPrice / 100;

      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        zipCode: session.metadata.zipCode,
        country: session.metadata.country,
      };

      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice,
        taxAmount,
        shippingAmount,
        totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      };

      await Order.create(orderData);

      //   console.log("Checkout session completed:", session);
      res.status(200).json({ success: true });
    }
  } catch (err) {
    console.error("Error while processing Stripe webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
};
