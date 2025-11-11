import {
  createCategory,
  deleteCategory,
  getCategories,
  getProductsByCategory,
  updateCategory,
} from "../controllers/categories";

const express = require("express");
const validate = require("../middlewares/validation");

const zod = require("zod");

const router = express.Router();

const categorySchema = zod.object({
  name: zod.string().min(1),
  imageUrl: string().url().optional().or(zod.literal("")),
});

router.get("/", getCategories);
router.get("/:id/products", getProductsByCategory);
router.post("/", validate(categorySchema), createCategory);
router.put("/:id", validate(categorySchema), updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
