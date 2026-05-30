import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  zehut: {
    type: String,
    required: true,
    unique: true,
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
  document: {
    type: Object,
    default: null,
  },
});

export default mongoose.model("Student", studentSchema);
