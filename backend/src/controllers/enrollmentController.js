import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// @desc Enroll student into a course
// @route POST /api/enrollments/enroll/:courseId
// @access Student
export const enrollCourse = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // Check if course exists and approved
    const course = await Course.findById(courseId);
    if (!course || course.status !== "approved") {
      return res.status(404).json({ message: "Course not available" });
    }

    // Prevent duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: "pending",
      paymentStatus: "pending",
      amountPaid: 0,
    });

    // Populate for response
    await enrollment.populate('course');

    res.status(201).json({
      message: "Enrollment created, waiting for payment",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get student enrolled courses
// @route GET /api/enrollments/my-courses
// @access Student
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({
      student: studentId,
      status: "active",
    }).populate("course").populate('student', 'name email');

    res.status(200).json({
      success: true,
      enrollments,
      total: enrollments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Approve enrollment (Teacher)
// @route PUT /api/enrollments/approve/:id
// @access Teacher
export const approveEnrollment = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { id } = req.params;

    const enrollment = await Enrollment.findById(id).populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Ensure teacher owns the course
    if (enrollment.course.teacher.toString() !== teacherId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    enrollment.status = "active";
    await enrollment.save();

    res.status(200).json({
      message: "Enrollment approved",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get students enrolled in teacher's courses
// @route GET /api/enrollments/teacher/list
// @access Teacher
export const getTeacherEnrollments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const enrollments = await Enrollment.find()
      .populate({
        path: "course",
        match: { teacher: teacherId },
      })
      .populate("student", "name email");

    // Filter out null courses (not owned by teacher)
    const filtered = enrollments.filter((e) => e.course !== null);

    res.status(200).json({
      success: true,
      enrollments: filtered,
      total: filtered.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Admin: get all enrollments
// @route GET /api/enrollments/all
// @access Admin
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email")
      .populate("course");

    res.status(200).json({
      success: true,
      enrollments,
      total: enrollments.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
