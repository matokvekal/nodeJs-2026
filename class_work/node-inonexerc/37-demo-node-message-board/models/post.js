import mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
    author: { type: String, required: true },
    text: String,
    color: { type: String, default: 'black' },
    image: Buffer,
});

export default mongoose.model('Post', postSchema);