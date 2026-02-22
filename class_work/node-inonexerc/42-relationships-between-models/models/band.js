import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bandSchema = new mongoose.Schema({
    name: String,
    genres: [String],
    members: [{ type: Schema.Types.ObjectId, ref: 'Artist' }],
});

export default mongoose.model('Band', bandSchema);

