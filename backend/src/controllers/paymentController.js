import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import Transaction from "../models/Transaction.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("KEY:", process.env.RAZORPAY_KEY_ID);


// @desc Create Razorpay order
// @route POST /api/payments/create-order/:enrollmentId
// @access Student
export const createOrder = async (req, res) => {
  try {
    const { enrollmentId } = req.params;

    const enrollment = await Enrollment.findById(enrollmentId).populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    if (enrollment.status === "active") {
      return res.status(400).json({ message: "Already paid for this course" });
    }

    const options = {
      amount: enrollment.course.price * 100, // convert to paisa
      currency: "INR",
      receipt: `rcpt_${enrollmentId}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      message: "Order created",
      order,
      enrollmentId,
      courseName: enrollment.course.title,
      amount: enrollment.course.price,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Verify Razorpay payment signature
// @route POST /api/payments/verify
// @access Student
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      enrollmentId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update enrollment status
    const enrollment = await Enrollment.findById(enrollmentId).populate("course");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Update enrollment with payment details
    enrollment.status = "active";
    enrollment.paymentStatus = "completed";
    enrollment.paymentId = razorpay_payment_id;
    enrollment.amountPaid = enrollment.course.price;
    await enrollment.save();

    // Create transaction record
    await Transaction.create({
      transactionId: razorpay_payment_id,
      enrollment: enrollmentId,
      amount: enrollment.course.price,
      gateway: "razorpay",
      teacher: enrollment.course.teacher,
      metadata: {
        razorpay_order_id,
        razorpay_signature,
      }
    });

    res.status(200).json({
      message: "Payment verified and course activated",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Get all payments
// @route GET /api/payments/all
// @access Admin
export const getAllPayments = async (req, res) => {
  try {
    const data = await Enrollment.find({ status: "active", paymentStatus: "completed" })
      .populate("student", "name email")
      .populate("course", "title price");

    const totalRevenue = data.reduce((sum, e) => sum + e.amountPaid, 0);

    res.status(200).json({
      totalPayments: data.length,
      totalRevenue,
      payments: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Teacher: Get payments for teacher's courses
// @route GET /api/payments/teacher
// @access Teacher
export const getTeacherPayments = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const enrollments = await Enrollment.find({ status: "active", paymentStatus: "completed" })
      .populate({
        path: "course",
        match: { teacher: teacherId },
        select: "title price",
      })
      .populate("student", "name email");

    const filtered = enrollments.filter((e) => e.course != null);
    
    const totalEarnings = filtered.reduce((sum, e) => sum + e.amountPaid, 0);

    res.status(200).json({
      totalEarnings,
      payments: filtered,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
