import mongoose from "mongoose";

// Employee schema - defines the shape of employee documents in MongoDB
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
  },
  email: {
    type: String,
  },
});

export default mongoose.model("Employee", employeeSchema);
