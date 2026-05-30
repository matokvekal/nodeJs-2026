import Employee from "../db/models/Employee.js";

// GET /employees  - return all employees
export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /employees/:id  - return one employee by MongoDB _id or employeeId
export const getEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne(buildQuery(req.params.id));
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /employees  - add a new employee
// Body: { name, employeeId, role, department, salary, email }
export const addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const saved = await employee.save();
    res.status(201).json({ message: "Employee added", data: saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /employees/:id  - update an employee
// Body: any fields to update, e.g. { salary: 8000 }
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndUpdate(
      buildQuery(req.params.id),
      req.body,
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee updated", data: employee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /employees/:id  - delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOneAndDelete(buildQuery(req.params.id));
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Build a MongoDB query: if id looks like an ObjectId use _id, otherwise use employeeId
function buildQuery(id) {
  const isObjectId = /^[a-fA-F0-9]{24}$/.test(id);
  return isObjectId ? { _id: id } : { employeeId: id };
}
