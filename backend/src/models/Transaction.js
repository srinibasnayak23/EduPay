import mongoose from 'mongoose';


const TransactionSchema = new mongoose.Schema({
transactionId: { type: String, required: true },
enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
amount: Number,
gateway: String,
metadata: Object,
teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


export default mongoose.model('Transaction', TransactionSchema);