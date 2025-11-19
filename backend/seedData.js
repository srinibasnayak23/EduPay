import mongoose from "mongoose";

// ----------------------
// 1. MongoDB Connection
// ----------------------
await mongoose.connect("mongodb://localhost:27017/edupay");
console.log("Connected to MongoDB");

// ----------------------
// 2. Define Schemas
// ----------------------
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  thumbnailUrl: String,
  status: String,
  duration: Number,
  enrolled: Number,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  phone: String,
  address: String,
  college: String,
  details: String,
  createdAt: Date,
});

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  status: String,
  progress: Number,
  amountPaid: Number,
  paymentId: String,
  paymentGateway: String,
  createdAt: Date,
});

const Course = mongoose.model("Course", courseSchema);
const User = mongoose.model("User", userSchema);
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

// ----------------------
// 3. Create Object IDs
// ----------------------

const teacherIds = Array.from({ length: 8 }).map(() => new mongoose.Types.ObjectId());
const studentId = new mongoose.Types.ObjectId();

const courseIds = Array.from({ length: 8 }).map(() => new mongoose.Types.ObjectId());


// ----------------------
// 4. MongoDB-ready data
// ----------------------

const users = [
  ...teacherIds.map((id, index) => ({
    _id: id,
    name: [
      "John Smith",
      "Sarah Johnson",
      "Mike Chen",
      "Emma Wilson",
      "David Lee",
      "Lisa Anderson",
      "James Martinez",
      "Robert Taylor"
    ][index],
    email: `teacher${index + 1}@example.com`,
    role: "teacher",
    createdAt: new Date("2023-01-10")
  })),
  {
    _id: studentId,
    name: "Rajesh Kumar",
    email: "rajesh@example.com",
    role: "student",
    phone: "+91 98765 43210",
    address: "123 Tech Street, Tech City, India",
    college: "Indian Institute of Technology",
    details: "Passionate learner exploring web and mobile development",
    createdAt: new Date("2023-02-15")
  }
];

const courses = [
  {
    _id: courseIds[0],
    title: "React.js - The Complete Guide",
    description: "Learn React from basics to advanced concepts with real-world projects",
    price: 4999,
    teacher: teacherIds[0],
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=400&h=200&fit=crop",
    status: "approved",
    duration: 40,
    enrolled: 1200
  },
  {
    _id: courseIds[1],
    title: "Web Design Fundamentals",
    description: "Master the principles of modern web design and UI/UX",
    price: 3999,
    teacher: teacherIds[1],
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
    status: "approved",
    duration: 35,
    enrolled: 850
  },
  {
    _id: courseIds[2],
    title: "Business Analytics Bootcamp",
    description: "Learn data analysis and business intelligence from industry experts",
    price: 5999,
    teacher: teacherIds[2],
    thumbnailUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    status: "approved",
    duration: 45,
    enrolled: 640
  },
  {
    _id: courseIds[3],
    title: "Digital Marketing Masterclass",
    description: "Become a digital marketing expert and grow your business online",
    price: 4499,
    teacher: teacherIds[3],
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-adf4198c838d?w=400&h=200&fit=crop",
    status: "approved",
    duration: 38,
    enrolled: 920
  },
  {
    _id: courseIds[4],
    title: "Python for Data Science",
    description: "Complete Python course with focus on data science and machine learning",
    price: 5499,
    teacher: teacherIds[4],
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f5ae4e8290f?w=400&h=200&fit=crop",
    status: "approved",
    duration: 50,
    enrolled: 1500
  },
  {
    _id: courseIds[5],
    title: "UX/UI Design with Figma",
    description: "Learn professional design tools and create stunning interfaces",
    price: 4799,
    teacher: teacherIds[5],
    thumbnailUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop",
    status: "approved",
    duration: 42,
    enrolled: 780
  },
  {
    _id: courseIds[6],
    title: "Mobile App Development",
    description: "Build iOS and Android apps with React Native and Flutter",
    price: 6499,
    teacher: teacherIds[6],
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=200&fit=crop",
    status: "approved",
    duration: 55,
    enrolled: 1100
  },
  {
    _id: courseIds[7],
    title: "Cloud Computing with AWS",
    description: "Master Amazon Web Services and cloud infrastructure",
    price: 5999,
    teacher: teacherIds[7],
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=200&fit=crop",
    status: "approved",
    duration: 48,
    enrolled: 680
  }
];

const enrollments = [
  {
    student: studentId,
    course: courseIds[0],
    status: "active",
    progress: 65,
    amountPaid: 4999,
    paymentId: "pay_1234567890",
    paymentGateway: "razorpay",
    createdAt: new Date("2024-01-10")
  },
  {
    student: studentId,
    course: courseIds[1],
    status: "active",
    progress: 40,
    amountPaid: 3999,
    paymentId: "pay_0987654321",
    paymentGateway: "razorpay",
    createdAt: new Date("2024-02-01")
  },
  {
    student: studentId,
    course: courseIds[4],
    status: "completed",
    progress: 100,
    amountPaid: 5499,
    paymentId: "pay_1111111111",
    paymentGateway: "razorpay",
    createdAt: new Date("2023-11-15")
  }
];

// ----------------------
// 5. Seed Database
// ----------------------
await User.insertMany(users);
await Course.insertMany(courses);
await Enrollment.insertMany(enrollments);

console.log("Sample data inserted!");
process.exit(0);
