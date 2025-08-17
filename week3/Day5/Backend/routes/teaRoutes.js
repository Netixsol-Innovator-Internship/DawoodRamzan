const express = require("express");
const {
  createTea,
  getTeas,
  getTeaById,
  updateTea,
  deleteTea,
  filterTeas,
} = require("../controllers/teaController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Teas
 *   description: Tea management
 */

/**
 * @swagger
 * /api/teas/:
 *   post:
 *     summary: Create a new tea (admin only)
 *     tags: [Teas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Green Tea
 *               price:
 *                 type: number
 *                 example: 9.99
 *               description:
 *                 type: string
 *                 example: Premium organic green tea
 *               category:
 *                 type: string
 *                 example: Green
 *     responses:
 *       201:
 *         description: Tea created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
router.post("/", protect, adminOnly, createTea);

/**
 * @swagger
 * /api/teas/:
 *   get:
 *     summary: Get all teas
 *     tags: [Teas]
 *     responses:
 *       200:
 *         description: List of teas
 */
router.get("/", getTeas);

/**
 * @swagger
 * /api/teas/filter:
 *   get:
 *     summary: Filter teas by category or other criteria
 *     tags: [Teas]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category to filter by
 *       - in: query
 *         name: priceMin
 *         schema:
 *           type: number
 *       - in: query
 *         name: priceMax
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Filtered list of teas
 */
router.get("/filter", filterTeas);

/**
 * @swagger
 * /api/teas/{id}:
 *   get:
 *     summary: Get a tea by ID
 *     tags: [Teas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tea ID
 *     responses:
 *       200:
 *         description: Tea details
 *       404:
 *         description: Tea not found
 */
router.get("/:id", getTeaById);

/**
 * @swagger
 * /api/teas/{id}:
 *   put:
 *     summary: Update a tea (admin only)
 *     tags: [Teas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tea ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tea updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Tea not found
 */
router.put("/:id", protect, adminOnly, updateTea);

/**
 * @swagger
 * /api/teas/{id}:
 *   delete:
 *     summary: Delete a tea (admin only)
 *     tags: [Teas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tea ID
 *     responses:
 *       200:
 *         description: Tea deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 *       404:
 *         description: Tea not found
 */
router.delete("/:id", protect, adminOnly, deleteTea);

module.exports = router;
