import API from "./axios";

export const getApprovedCourses = () => API.get("/courses/approved");

export const getCourseById = (id) => API.get(`/courses/${id}`);

export const createCourse = (data) => API.post("/courses", data);

export const updateCourse = (id, data) => API.put(`/courses/${id}`, data);

export const deleteCourse = (id) => API.delete(`/courses/${id}`);

export const getTeacherCourses = () => API.get("/courses/teacher/my-courses");

export const adminGetAllCourses = () => API.get("/courses");

export const adminApproveCourse = (id, status) =>
  API.put(`/courses/approve/${id}`, { status });

export const adminDeleteCourse = (id, status) =>
  API.delete(`/courses/admin/${id}`, { status });
