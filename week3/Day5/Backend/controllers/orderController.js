const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Tea = require("../models/Tea");

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.tea"
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + item.tea.price * item.quantity;
    }, 0);

    const order = new Order({
      user: req.user.id,
      items: cart.items.map((i) => ({
        tea: i.tea._id,
        quantity: i.quantity,
      })),
      totalPrice,
    });

    await order.save();
    await Cart.deleteOne({ _id: cart._id });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.tea"
    );
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
