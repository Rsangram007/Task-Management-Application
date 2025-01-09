const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getStatistics,
} = require("../controllers/taskController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/statistics", getStatistics);

module.exports = router;
