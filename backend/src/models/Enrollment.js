import mongoose from 'mongoose';


const EnrollmentSchema = new mongoose.Schema({
student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
amountPaid: { type: Number, default: 0 },
paymentGateway: { type: String, enum: ['razorpay','stripe'], default: 'razorpay' },
paymentId: String,
status: { type: String, enum: ['pending', 'active', 'completed'], default: 'pending' },
paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
}, { timestamps: true });


EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


export default mongoose.model('Enrollment', EnrollmentSchema);