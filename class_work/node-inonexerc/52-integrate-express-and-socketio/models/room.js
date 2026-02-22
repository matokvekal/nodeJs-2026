import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    messages: [{
        from: String,
        text: String,
    }]
});

roomSchema.statics.findOrCreateOne = function findOrCreateOne(name) {
    const Room = this;
    const doc = { name };
    return new Promise((resolve, reject) => {
        Room.findOne(doc).then(found => {
            if (found) {
                return resolve(found);
            } else {
                Room.create(doc).then(resolve).catch(reject);
            }
        });
    });
}

export default mongoose.model('Room', roomSchema);
