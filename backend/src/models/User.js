import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
name: { type: String, required: true },
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, enum: ['admin','teacher','student'], default: 'student' },
phone: String,
address: String,
college: String,
details: String,
}, { timestamps: true });


export default mongoose.model('User', UserSchema);