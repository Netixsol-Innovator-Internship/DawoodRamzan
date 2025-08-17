const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.get("/", protect, getCart);
router.post("/update", protect, updateCartQuantity); // ✅ New API

module.exports = router;
