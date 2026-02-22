///////////
import { useState, useEffect } from "react";

function Students() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    debugger;
    fetch("http://localhost:3000/reactstudents")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching data:", error.message));
  }, []);

  return (
    <div>
      <h1>React Students Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 &&
            students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>
                  <button onClick={() => addStudent()}>➕</button>
                  <button onClick={() => deleteStudent(student.id)}>❌</button>
                  <button onClick={() => updateStudent(student.id)}>✏️</button>
                </td>
              </tr>
            ))}
          <h6>total students {students.length}</h6>
        </tbody>
      </table>
    </div>
  );

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
}

export default Students;
