import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAdminStats,
} from "../controllers/userController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Admin only
router.get("/stats", protect, authorize("admin"), getAdminStats);
router.get("/", protect, authorize("admin"), getAllUsers);
router.get("/:id", protect, authorize("admin"), getUserById);
router.put("/:id", protect, authorize("admin"), updateUser);
router.delete("/:id", protect, authorize("admin"), deleteUser);

export default router;
