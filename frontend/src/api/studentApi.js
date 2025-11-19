import api from "./axios";

export const fetchApprovedCourses = () => api.get("/courses/approved");
export const fetchCourseById = (id) => api.get(`/courses/${id}`);
export const createEnrollment = (courseId) => api.post(`/enrollments/enroll/${courseId}`);
export const createRazorOrder = (enrollmentId) => api.post(`/payments/create-order/${enrollmentId}`);
export const verifyRazorPayment = (payload) => api.post("/payments/verify", payload);
export const fetchMyEnrollments = () => api.get("/enrollments/my-courses");
export const getTeacherEnrollments = () => api.get("/enrollments/teacher/list");
export const approveEnrollment = (id) => api.put(`/enrollments/approve/${id}`);
export const updateProfile = (payload) => api.put("/users/me", payload);
export const getAllUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
