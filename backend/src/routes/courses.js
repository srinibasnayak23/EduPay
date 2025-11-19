import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getApprovedCourses,
  getCourseById,
  approveCourse,
  getTeacherCourses,
  adminDeleteCourse,
} from "../controllers/courseController.js";

import { protect, authorize } from "../middlewares/auth.js";

const router = express.Router();

// Teacher
router.post("/", protect, authorize("teacher"), createCourse);
router.put("/:id", protect, authorize("teacher"), updateCourse);
router.delete("/:id", protect, authorize("teacher"), deleteCourse);
router.get("/teacher/my-courses", protect, authorize("teacher"), getTeacherCourses);

// Admin
router.put("/approve/:id", protect, authorize("admin"), approveCourse);
router.delete("/admin/:id", protect, authorize("admin"), adminDeleteCourse);

// Public / Student
router.get("/", getAllCourses);
router.get("/approved", getApprovedCourses);
router.get("/:id", getCourseById);

export default router;
