import API from "./axios";

export const createOrder = (enrollmentId) =>
  API.post(`/payments/create-order/${enrollmentId}`);

export const verifyPayment = (payload) =>
  API.post("/payments/verify", payload);

export const getAllPayments = () =>
  API.get("/payments/all");

export const getTeacherPayments = () =>
  API.get("/payments/teacher");
