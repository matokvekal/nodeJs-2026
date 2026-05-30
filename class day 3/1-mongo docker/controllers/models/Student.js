import mongoose from "mongoose";

// Student schema - defines the shape of student documents in MongoDB
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  zehut: {
    type: String,
    required: true,
    unique: true, // no two students can have the same ID number
  },
  phone: {
    type: String,
  },
  degree: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  // "document" is a flexible field for storing any extra data (e.g. uploaded files info)
  document: {
    type: Object,
    default: null,
  },
});

export default mongoose.model("Student", studentSchema);
