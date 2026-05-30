import { useState, useEffect } from "react";

const TABLE_STYLE = { width: "100%", borderCollapse: "collapse", marginTop: "12px" };
const TH_STYLE = { background: "#374151", color: "#e5e7eb", padding: "8px 12px", textAlign: "left", border: "1px solid #4b5563" };
const TD_STYLE = { padding: "7px 12px", border: "1px solid #4b5563", color: "#d1d5db" };
const ROW_ALT = { background: "#1f2937" };
const ROW_NORM = { background: "#111827" };
const INPUT_STYLE = { padding: "7px 10px", borderRadius: "5px", border: "1px solid #4b5563", background: "#1f2937", color: "#f9fafb", width: "100%" };

const EMPTY_FORM = { name: "", employeeId: "", role: "", department: "", salary: "", email: "" };

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [single, setSingle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    fetch("/employees")
      .then((r) => r.json())
      .then((data) => { setEmployees(data); setLoading(false); })
      .catch(() => { setError("Failed to load employees"); setLoading(false); });
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchId.trim()) return;
    setError("");
    setSingle(null);
    try {
      const res = await fetch(`/employees/${searchId.trim()}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Not found"); return; }
      setSingle(data);
    } catch {
      setError("Request failed");
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAddError("");
    setAddSuccess("");
    const body = { ...form };
    if (body.salary) body.salary = Number(body.salary);
    else delete body.salary;
    if (!body.email) delete body.email;

    try {
      const res = await fetch("/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.message || "Failed to add"); return; }
      setEmployees((prev) => [...prev, data.data]);
      setAddSuccess(`Employee "${data.data.name}" added!`);
      setForm(EMPTY_FORM);
    } catch {
      setAddError("Request failed");
    }
  }

  const rows = single ? [single] : employees;

  return (
    <div style={{ padding: "20px", color: "#f9fafb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Employees</h2>
        <button
          onClick={() => { setShowAdd((v) => !v); setAddError(""); setAddSuccess(""); }}
          style={{ padding: "6px 14px", background: showAdd ? "#374151" : "#059669", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {showAdd ? "Cancel" : "+ Add Employee"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#1f2937", padding: "16px", borderRadius: "8px", marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Name *
            <input required style={INPUT_STYLE} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Employee ID *
            <input required style={INPUT_STYLE} value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Role *
            <input required style={INPUT_STYLE} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Department *
            <input required style={INPUT_STYLE} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Salary
            <input type="number" style={INPUT_STYLE} value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Email
            <input type="email" style={INPUT_STYLE} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px", alignItems: "center" }}>
            <button type="submit" style={{ padding: "8px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Save Employee
            </button>
            {addError && <span style={{ color: "#f87171", fontSize: "13px" }}>{addError}</span>}
            {addSuccess && <span style={{ color: "#34d399", fontSize: "13px" }}>{addSuccess}</span>}
          </div>
        </form>
      )}

      <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
        <input
          value={searchId}
          onChange={(e) => { setSearchId(e.target.value); setSingle(null); setError(""); }}
          placeholder="Search by _id or employeeId"
          style={{ padding: "7px 12px", borderRadius: "5px", border: "1px solid #4b5563", background: "#1f2937", color: "#f9fafb", width: "280px" }}
        />
        <button type="submit" style={{ padding: "7px 16px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Get One
        </button>
        {single && (
          <button type="button" onClick={() => { setSingle(null); setSearchId(""); }} style={{ padding: "7px 14px", background: "#374151", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Show All
          </button>
        )}
      </form>

      {error && <p style={{ color: "#f87171" }}>{error}</p>}
      {loading && <p style={{ color: "#9ca3af" }}>Loading...</p>}
      {!loading && rows.length === 0 && <p style={{ color: "#9ca3af" }}>No employees found.</p>}

      {!loading && rows.length > 0 && (
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Employee ID</th>
              <th style={TH_STYLE}>Name</th>
              <th style={TH_STYLE}>Role</th>
              <th style={TH_STYLE}>Department</th>
              <th style={TH_STYLE}>Salary</th>
              <th style={TH_STYLE}>Email</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((emp, i) => (
              <tr key={emp._id} style={i % 2 === 0 ? ROW_NORM : ROW_ALT}>
                <td style={TD_STYLE}>{emp.employeeId}</td>
                <td style={TD_STYLE}>{emp.name}</td>
                <td style={TD_STYLE}>{emp.role}</td>
                <td style={TD_STYLE}>{emp.department}</td>
                <td style={TD_STYLE}>{emp.salary ?? "—"}</td>
                <td style={TD_STYLE}>{emp.email ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Employees;
