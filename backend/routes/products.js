const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const express = require("express");
const validate = require("../middlewares/validation");

const zod = require("zod");

const router = express.Router();

const productSchema = zod.object({
  categoryId: zod.string(),
  name: zod.string().min(1),
  price: zod.number().positive(),
  imageUrl: zod.string().optional(),
  description: zod.string().optional(),
});

const updateProductSchema = zod.object({
  name: zod.string().min(1).optional(),
  price: zod.number().positive().optional(),
  imageUrl: zod.string().optional(),
  description: zod.string().optional(),
});

router.get("/", getProducts);
router.get("/:id/products", getProduct);
router.post("/", validate(productSchema), createProduct);
router.post("/:id", validate(updateProductSchema), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
