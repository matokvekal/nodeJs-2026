import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: String,
});

export default mongoose.model('Contact', contactSchema);