import Student from "../db/models/Student.js";

// GET /students  - return all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /students/:id  - return one student by MongoDB _id or zehut
export const getStudent = async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /students  - add a new student
// Body: { name, zehut, phone, degree, year }
export const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    const saved = await student.save();
    res.status(201).json({ message: "Student added", data: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /students/:id  - update a student
// Body: any fields to update, e.g. { year: 3 }
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      buildQuery(req.params.id), // find by _id or zehut
      req.body,
      { new: true, runValidators: true } // return updated doc + validate
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated", data: student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /students/:id  - delete a student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOneAndDelete(buildQuery(req.params.id));
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /students/:id/document  - get the document attached to a student
export const getDocument = async (req, res) => {
  try {
    const student = await findStudent(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ document: student.document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /students/:id/document  - attach a document to a student
// Accepts a real file upload (multipart/form-data, field "file")
// The actual file is saved on disk by multer; we store the metadata in MongoDB
export const addDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const docInfo = {
      originalName: req.file.originalname,
      savedAs: req.file.filename,          // timestamped filename on disk
      url: `/uploads/${req.file.filename}`, // public URL to download the file
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };

    const student = await Student.findOneAndUpdate(
      buildQuery(req.params.id),
      { document: docInfo },
      { new: true }
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Document saved", document: student.document });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- helpers ---

// Build a MongoDB query: if id looks like an ObjectId use _id, otherwise use zehut
function buildQuery(id) {
  const isObjectId = /^[a-fA-F0-9]{24}$/.test(id);
  return isObjectId ? { _id: id } : { zehut: id };
}

async function findStudent(id) {
  return Student.findOne(buildQuery(id));
}
