function Menu({ selected, onSelect }) {
  return (
    <nav style={{ display: "flex", gap: "12px", padding: "12px", background: "#1e1e2e" }}>
      <button
        onClick={() => onSelect("employees")}
        style={{
          padding: "8px 20px",
          cursor: "pointer",
          background: selected === "employees" ? "#7c3aed" : "#374151",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: selected === "employees" ? "bold" : "normal",
        }}
      >
        Employees
      </button>
      <button
        onClick={() => onSelect("students")}
        style={{
          padding: "8px 20px",
          cursor: "pointer",
          background: selected === "students" ? "#7c3aed" : "#374151",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: selected === "students" ? "bold" : "normal",
        }}
      >
        Students
      </button>
    </nav>
  );
}

export default Menu;
