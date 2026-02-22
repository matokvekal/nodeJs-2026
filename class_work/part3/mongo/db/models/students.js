import mongoose from "mongoose";
const Schema = mongoose.Schema;

const students = new Schema({
  name: {
    type: String,
    required: true, // Name is required
    minlength: 3, // Minimum length of name is 3 characters
  },
  zehut: {
    type: String,
    required: true, // is required
    unique: true, // must be unique
  },
  phone: {
    type: String,
    minlength: 10, // Assuming a minimum length of 10 digits for a phone number
  },
  degree: {
    type: String,
    required: true, // Faculty is required
  },
  year: {
    type: Number,
    required: true, // Year is required
  },
  data: {
    type: Object,
  },
});

export default mongoose.model("students", students);
