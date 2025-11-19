import mongoose from 'mongoose';


const CourseSchema = new mongoose.Schema({
title: { type: String, required: true },
description: String,
price: { type: Number, required: true, min: 0 },
teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
thumbnailUrl: String,
studentsEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });


CourseSchema.index({ title: 'text', description: 'text' });


export default mongoose.model('Course', CourseSchema);