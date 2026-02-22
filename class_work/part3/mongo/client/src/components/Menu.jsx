import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Projects from "./Projects";
import Students from "./Students";

function Menu() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Router>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/students">Students</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<div>Hello Class!</div>} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/students" element={<Students />} />
        </Routes>
      </Router>
    </div>
  );
}

export default Menu;
