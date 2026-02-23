export const getStudents = (req, res) => {
  const students = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
  ];
  let html = `
  <h1>Students Table</h1>
  <table border="1">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
`;
  students.forEach((student) => {
    html += `
    <tr>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>
      <button onclick="addStudent()">➕</button>
      <button onclick="deleteStudent(${student.id})"> </button>
        <button onclick="updateStudent(${student.id})">✏️</button
      </td>
    </tr>
  `;
  });
  html += `
      </tbody>
    </table>
    <script>
      function addStudent() {
        // Implement logic for adding a student
        alert("Add student");
      }

      function deleteStudent(id) {
        // Implement logic for deleting a student by ID
        alert("Delete student with ID: " + id);
      }

      function updateStudent(id) {
        // Implement logic for updating a student by ID
        alert("Update student with ID: " + id);
      }
    </script>
  `;
  res.send(html);
  // res.json(html);
  // res.json({ message: "Retrieve all students" });
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
