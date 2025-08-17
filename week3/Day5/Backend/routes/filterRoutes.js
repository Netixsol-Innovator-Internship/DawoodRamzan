const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    collections: [
      "Black tea",
      "Green tea",
      "White tea",
      "Chai",
      "Matcha",
      "Herbal teas",
      "Oolong",
      "Rooibos",
      "Tisane",
    ],
    origins: ["India", "Japan", "Sri Lanka", "South Africa"],
    flavours: [
      "Spicy",
      "Sweet",
      "Citrus",
      "Smooth",
      "Fruity",
      "Floral",
      "Grassy",
      "Minty",
      "Bitter",
      "Creamy",
    ],
    qualities: ["Detox", "Energy", "Relax", "Digestion"],
    caffeine: [
      "No Caffeine",
      "Low Caffeine",
      "Medium Caffeine",
      "High Caffeine",
    ],
    allergens: ["Lactose-free", "Gluten-free", "Nut-free", "Soy-free"],
    organic: ["Yes", "No"],
  });
});

module.exports = router;
