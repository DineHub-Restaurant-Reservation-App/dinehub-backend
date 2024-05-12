const {
  createNewCategory,
  updateCategory,
  deleteCategory,
  addCategoryMenuItem,
  updateCategoryMenuItem,
  deleteCategoryMenuItem,
  getMenuById,
  getCategoryById,
  getCategoryItemsById,
} = require("../controllers/menu.controller");
const { verifyToken } = require("../middleware/verifyToken");

const router = require("express").Router();

router.use(verifyToken);

router.get("/:menuId", getMenuById);

router.post("/category", createNewCategory);
router.get("/category/:id", getCategoryById);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);

router.post("/category/:id/item", addCategoryMenuItem);
router.get("/category/item/:menuId", getCategoryItemsById);
router.put("/category/:categoryId/item/:menuId", updateCategoryMenuItem);
router.delete("/category/:categoryId/item/:menuId", deleteCategoryMenuItem);

module.exports = router;
