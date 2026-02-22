export const getStudents = (req, res) => {
  const students = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  res.json(students);
};

export const getStudent = (req, res) => {
  const { id } = req.params;
  res.json({ message: `Retrieve student with ID: ${id}` });
};

export const addStudent = (req, res) => {
  const student = req.body;
  // Logic to add student to database
  res.json({ message: "Student added", data: student });
};

export const deleteStudent = (req, res) => {
  const { id } = req.params;
  // Logic to delete student from database
  res.json({ message: `Student with ID: ${id} deleted` });
};

export const updateStudent = (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  // Logic to update student in database
  res.json({ message: `Student with ID: ${id} updated`, data: updatedData });
};
