import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// GET all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user by ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Prevent password updates here
    if (updates.password) delete updates.password;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET Admin Dashboard Stats
export const getAdminStats = async (req, res) => {
  try {
    // Total courses
    const totalCourses = await Course.countDocuments();

    // Total students (users with role 'student')
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Total teachers (users with role 'teacher')
    const totalTeachers = await User.countDocuments({ role: 'teacher' });

    // Total revenue (sum of amountPaid from completed enrollments)
    const payments = await Enrollment.find({ 
      status: "active", 
      paymentStatus: "completed" 
    });
    const totalRevenue = payments.reduce((sum, e) => sum + e.amountPaid, 0);

    // Total enrollments
    const totalEnrollments = await Enrollment.countDocuments();

    res.json({
      stats: {
        totalCourses,
        totalStudents,
        totalTeachers,
        totalRevenue,
        totalEnrollments,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
