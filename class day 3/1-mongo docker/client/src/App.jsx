import { useState } from "react";
import Menu from "./components/Menu";
import Employees from "./components/Employees";
import Students from "./components/Students";

function App() {
  const [view, setView] = useState("employees");

  return (
    <div style={{ minHeight: "100vh", background: "#111827", fontFamily: "sans-serif" }}>
      <Menu selected={view} onSelect={setView} />
      {view === "employees" && <Employees />}
      {view === "students" && <Students />}
    </div>
  );
}

export default App;
