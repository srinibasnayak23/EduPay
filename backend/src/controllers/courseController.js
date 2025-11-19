// =============================
// controllers/courseController.js
// =============================
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// Create Course (Teacher)
export const createCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { title, description, price, thumbnailUrl } = req.body;
    console.log("Received course data:", req.body);

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Course title is required" });
    }

    if (price === undefined || price === null) {
      return res.status(400).json({ success: false, message: "Course price is required" });
    }

    // if (typeof price !== 'number' || price < 0) {
    //   return res.status(400).json({ success: false, message: "Course price must be a positive number" });
    // }

    const course = await Course.create({
      title: title.trim(),
      description: description?.trim() || "",
      price,
      thumbnailUrl: thumbnailUrl || null,
      teacher: teacherId,
    });

    res.status(201).json({ success: true, message: "Course created", course });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get all approved courses (Student View)
export const getApprovedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" }).populate(
      "teacher",
      "name email"
    );
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Get all courses (Admin)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Approve / Reject Course (Admin)
export const approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved / rejected / pending
    console.log("Course approval data:", { id, status });

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updated = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("teacher", "name email");

    if (!updated) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course status updated", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Teacher – Get My Courses
export const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ teacher: teacherId });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Edit Course (Teacher)
export const updateCourse = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;
    const { title, description, price, thumbnailUrl } = req.body;

    // Validation
    if (title !== undefined && (!title || title.trim().length === 0)) {
      return res.status(400).json({ success: false, message: "Course title cannot be empty" });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return res.status(400).json({ success: false, message: "Course price must be a positive number" });
    }

    const course = await Course.findOne({ _id: id, teacher: teacherId });
    if (!course)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = price;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;

    const updated = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ success: true, message: "Course updated", course: updated });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Delete Course (Teacher)
export const deleteCourse = async (req, res) => {
  try {
    //const teacherId = req.user.id;
    const { id } = req.params;

    const course = await Course.findOne({ _id: id });
    if (!course)
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });

    await course.deleteOne();

    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Delete Course by Admin
export const adminDeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    // Check if course has active enrollments
    const enrollmentCount = await Enrollment.countDocuments({
      course: id,
      status: { $in: ["active", "pending"] }
    });

    if (enrollmentCount > 0)
      return res.status(400).json({
        success: false,
        message: `Cannot delete course. ${enrollmentCount} student(s) are currently enrolled.`
      });

    await course.deleteOne();

    res.json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Get Single Course (Course Details)
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate(
      "teacher",
      "name email"
    );

    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
