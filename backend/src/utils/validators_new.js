// Validation Utility Functions
// Handles input validation

const validators = {
  // Validate email
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password (min 6 chars)
  isValidPassword: (password) => {
    return password && password.length >= 6;
  },

  // Validate user data
  validateUserData: (userData) => {
    const errors = [];
    
    if (!userData.name || userData.name.trim().length === 0) {
      errors.push("Name is required");
    }
    
    if (!userData.email || !validators.isValidEmail(userData.email)) {
      errors.push("Valid email is required");
    }
    
    if (userData.password && !validators.isValidPassword(userData.password)) {
      errors.push("Password must be at least 6 characters");
    }
    
    if (userData.role && !['student', 'teacher', 'admin'].includes(userData.role)) {
      errors.push("Invalid role");
    }
    
    return errors;
  },

  // Validate course data
  validateCourseData: (courseData) => {
    const errors = [];
    
    if (!courseData.title || courseData.title.trim().length === 0) {
      errors.push("Course title is required");
    }
    
    if (courseData.price === undefined || courseData.price === null) {
      errors.push("Course price is required");
    } else if (typeof courseData.price !== 'number' || courseData.price < 0) {
      errors.push("Course price must be a positive number");
    }
    
    if (courseData.description && courseData.description.trim().length < 10) {
      errors.push("Course description must be at least 10 characters");
    }
    
    return errors;
  },

  // Validate payment data
  validatePaymentData: (paymentData) => {
    const errors = [];
    
    if (!paymentData.razorpay_order_id) {
      errors.push("Razorpay order ID is required");
    }
    
    if (!paymentData.razorpay_payment_id) {
      errors.push("Razorpay payment ID is required");
    }
    
    if (!paymentData.razorpay_signature) {
      errors.push("Razorpay signature is required");
    }
    
    if (!paymentData.enrollmentId) {
      errors.push("Enrollment ID is required");
    }
    
    return errors;
  },

  // Validate enrollment data
  validateEnrollmentData: (enrollmentData) => {
    const errors = [];
    
    if (!enrollmentData.courseId) {
      errors.push("Course ID is required");
    }
    
    if (!enrollmentData.studentId) {
      errors.push("Student ID is required");
    }
    
    return errors;
  },
};

export default validators;
