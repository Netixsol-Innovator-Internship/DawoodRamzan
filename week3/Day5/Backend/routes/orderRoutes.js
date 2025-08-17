const express = require("express");
const { placeOrder, getOrders } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders/:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - totalAmount
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     teaId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               totalAmount:
 *                 type: number
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, placeOrder);

/**
 * @swagger
 * /api/orders/:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getOrders);

module.exports = router;
