import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllPayments,
  getTeacherPayments,
} from "../controllers/paymentController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Student payment flow
router.post("/create-order/:enrollmentId", protect, authorize("student"), createOrder);
router.post("/verify", protect, authorize("student"), verifyPayment);

// Admin
router.get("/all", protect, authorize("admin"), getAllPayments);

// Teacher earnings
router.get("/teacher", protect, authorize("teacher"), getTeacherPayments);

export default router;
