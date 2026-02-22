import Students from "../db/models/students.js";

export const getStudents = async (req, res) => {
  try {
    const allStudents = await Students.find();
    res.json(allStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudent = async (req, res) => {
  const { id } = req.params;
  
  let query;

  // Check if the provided ID is likely an ObjectId
  if (id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
    query = { _id: id };
  } else {
    query = { zehut: id };
  }

  try {
    const student = await Students.findOne(query);
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: `No student found with the identifier: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//http://localhost:5000/students/651c1b5c6c6488cfaea00d32
//or
//http://localhost:5000/students/5481

export const addStudent = async (req, res) => {
  console.log("at addStudent");
  try {
    const data = req.body;
    const student = new Students({
      name: data.name,
      zehut: data.zehut,
      phone: data.phone,
      degree: data.degree,
      year: Number(data.year),
      mark: Number(data.mark),
    });
    //we have to save data to db
    const result = await student.save();
    result
      ? res.json({ message: "Student added", data: student })
      : res.status(500).json({ message: "Student not added", data: student });
  } catch (err) {
    console.log("error at addStudent", err);
    res.status(500).json({ message: "Some error has accured" });
    //SECURITY ISSUE
    // res.status(500).json({message: err.message});
  }
};
//use it with postman
//localhost:5000/students
//{"name":"John", "zehut":"123", "phone":"0542288555", "degree":"CS", "year":2, "mark":90}

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  let query;
  if (id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
    query = { _id: id };
  } else {
    query = { zehut: id };
  }
  try {
    const student = await Students.findOneAndDelete(query);
    if (student) {
      res.json({ message: `Student with ID: ${id} deleted` });
    } else {
      res.status(404).json({ message: `No student found with the identifier: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// postman DELETE   http://localhost:5000/students/651c1b5c6c6488cfaea00d32

export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  
  let query;

  // Check if the provided ID is likely an ObjectId
  if (id.length === 24 && /^[a-fA-F0-9]+$/.test(id)) {
    query = { _id: id };
  } else {
    query = { zehut: id };
  }

  try {
    const student = await Students.findOneAndUpdate(query, updatedData, {
      new: true, // This option returns the modified document rather than the original.
      runValidators: true // Ensures all updates will run through model's validation.
    });
    
    if (student) {
      res.json({ message: `Student with ID: ${id} updated`, data: student });
    } else {
      res.status(404).json({ message: `No student found with the identifier: ${id}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//post man    PUT   http://localhost:5000/students/651c1b406c6488cfaea00d2e
// {
//   "mark": 60
// }
