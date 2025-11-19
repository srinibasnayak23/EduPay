// Sample data seeder for EduPay
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Course from "./models/Course.js";
import Enrollment from "./models/Enrollment.js";
import Transaction from "./models/Transaction.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/edupay";

async function seed() {
  await connectDB(MONGO_URI);

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Enrollment.deleteMany({}),
    Transaction.deleteMany({}),
  ]);

  // Create sample users
  const admin = await User.create({
    name: "Admin User",
    email: "admin@edupay.com",
    password: "password123",
    role: "admin",
    phone: "9999999999",
    address: "EduPay HQ",
  });

  const teachers = await User.insertMany([
    {
      name: "Alice Teacher",
      email: "alice@edupay.com",
      password: "password123",
      role: "teacher",
      phone: "8888888888",
      college: "Tech University",
    },
    {
      name: "Bob Teacher",
      email: "bob@edupay.com",
      password: "password123",
      role: "teacher",
      phone: "7777777777",
      college: "Science College",
    },
  ]);

  const students = await User.insertMany([
    {
      name: "Charlie Student",
      email: "charlie@edupay.com",
      password: "password123",
      role: "student",
      phone: "6666666666",
      college: "Tech University",
    },
    {
      name: "Daisy Student",
      email: "daisy@edupay.com",
      password: "password123",
      role: "student",
      phone: "5555555555",
      college: "Science College",
    },
    {
      name: "Eve Student",
      email: "eve@edupay.com",
      password: "password123",
      role: "student",
      phone: "4444444444",
      college: "Tech University",
    },
  ]);

  // Create sample courses
  const courses = await Course.insertMany([
    {
      title: "React for Beginners",
      description: "Learn React from scratch.",
      price: 3999,
      teacher: teachers[0]._id,
      approved: true,
      thumbnailUrl: "https://source.unsplash.com/400x200/?react,code",
    },
    {
      title: "Node.js Masterclass",
      description: "Deep dive into Node.js backend development.",
      price: 4999,
      teacher: teachers[1]._id,
      approved: true,
      thumbnailUrl: "https://source.unsplash.com/400x200/?nodejs,backend",
    },
    {
      title: "Data Structures",
      description: "Essential data structures for coding interviews.",
      price: 2999,
      teacher: teachers[0]._id,
      approved: false,
      thumbnailUrl: "https://source.unsplash.com/400x200/?data,structure",
    },
  ]);

  // Create sample enrollments
  const enrollments = await Enrollment.insertMany([
    {
      student: students[0]._id,
      course: courses[0]._id,
      amountPaid: 3999,
      paymentGateway: "razorpay",
      paymentId: "pay_001",
      status: "completed",
    },
    {
      student: students[1]._id,
      course: courses[1]._id,
      amountPaid: 4999,
      paymentGateway: "razorpay",
      paymentId: "pay_002",
      status: "completed",
    },
    {
      student: students[2]._id,
      course: courses[2]._id,
      amountPaid: 2999,
      paymentGateway: "razorpay",
      paymentId: "pay_003",
      status: "pending",
    },
  ]);

  // Create sample transactions
  await Transaction.insertMany([
    {
      transactionId: "txn_001",
      enrollment: enrollments[0]._id,
      amount: 3999,
      gateway: "razorpay",
      teacher: teachers[0]._id,
      metadata: { orderId: "order_001" },
    },
    {
      transactionId: "txn_002",
      enrollment: enrollments[1]._id,
      amount: 4999,
      gateway: "razorpay",
      teacher: teachers[1]._id,
      metadata: { orderId: "order_002" },
    },
    {
      transactionId: "txn_003",
      enrollment: enrollments[2]._id,
      amount: 2999,
      gateway: "razorpay",
      teacher: teachers[0]._id,
      metadata: { orderId: "order_003" },
    },
  ]);

  console.log("Sample data seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
