export const getStudent = (req, res) => {
  res.json({ messge: `Retrieve student` });
};

export const addStudent = (req, res) => {
  res.json({ message: "Student added" });
};

export const deleteStudent = (req, res) => {
  res.json({ message: `deleteStudent` });
};

export const updateStudent = (req, res) => {
  res.json({ message: `updateStudent` });
};

export const getStudents = async (req, res) => {
  res.json({ message: `getStudents` });
};
