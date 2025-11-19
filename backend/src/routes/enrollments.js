import express from "express";
import {
  enrollCourse,
  getMyCourses,
  approveEnrollment,
  getTeacherEnrollments,
  getAllEnrollments,
} from "../controllers/enrollmentController.js";

import {protect, authorize} from "../middlewares/auth.js"

const router = express.Router();

// Student
router.post("/enroll/:courseId", protect, authorize("student"), enrollCourse);
router.get("/my-courses", protect, authorize("student"), getMyCourses);

// Teacher
router.get("/teacher/list", protect, authorize("teacher"), getTeacherEnrollments);
router.put("/approve/:id", protect, authorize("teacher"), approveEnrollment);

// Admin
router.get("/all", protect, authorize("admin"), getAllEnrollments);

export default router;
