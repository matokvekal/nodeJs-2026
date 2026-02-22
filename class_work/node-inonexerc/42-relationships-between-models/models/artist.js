import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
    name: String,
    born: Number,
    died: Number,
});

export default mongoose.model('Artist', artistSchema);


