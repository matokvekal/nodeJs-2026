import { useState, useEffect } from "react";

const TABLE_STYLE = { width: "100%", borderCollapse: "collapse", marginTop: "12px" };
const TH_STYLE = { background: "#374151", color: "#e5e7eb", padding: "8px 12px", textAlign: "left", border: "1px solid #4b5563" };
const TD_STYLE = { padding: "7px 12px", border: "1px solid #4b5563", color: "#d1d5db" };
const ROW_ALT = { background: "#1f2937" };
const ROW_NORM = { background: "#111827" };
const INPUT_STYLE = { padding: "7px 10px", borderRadius: "5px", border: "1px solid #4b5563", background: "#1f2937", color: "#f9fafb", width: "100%" };

const EMPTY_FORM = { name: "", zehut: "", phone: "", degree: "", year: "" };

function DocumentCell({ doc }) {
  if (!doc) return "—";
  if (doc.url) {
    return (
      <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noreferrer"
        style={{ color: "#818cf8" }}>
        {doc.originalName}
      </a>
    );
  }
  return JSON.stringify(doc);
}

function UploadForm({ studentId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setMsg(""); setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`/students/${studentId}/document`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setErr(data.message || "Upload failed"); return; }
      setMsg(`Uploaded: ${data.document.originalName}`);
      setFile(null);
      onUploaded(studentId, data.document);
    } catch {
      setErr("Upload failed");
    }
  }

  return (
    <form onSubmit={handleUpload} style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])}
        style={{ color: "#d1d5db", fontSize: "12px" }} />
      <button type="submit" disabled={!file}
        style={{ padding: "4px 10px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px" }}>
        Upload
      </button>
      {msg && <span style={{ color: "#34d399", fontSize: "12px" }}>{msg}</span>}
      {err && <span style={{ color: "#f87171", fontSize: "12px" }}>{err}</span>}
    </form>
  );
}

function Students() {
  const [students, setStudents] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [single, setSingle] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  useEffect(() => {
    fetch("/students")
      .then((r) => r.json())
      .then((data) => { setStudents(data); setLoading(false); })
      .catch(() => { setError("Failed to load students"); setLoading(false); });
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchId.trim()) return;
    setError(""); setSingle(null);
    try {
      const res = await fetch(`/students/${searchId.trim()}`);
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Not found"); return; }
      setSingle(data);
    } catch {
      setError("Request failed");
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    setAddError(""); setAddSuccess("");
    const body = { ...form, year: Number(form.year) };
    if (!body.phone) delete body.phone;
    try {
      const res = await fetch("/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setAddError(data.message || "Failed to add"); return; }
      setStudents((prev) => [...prev, data.data]);
      setAddSuccess(`Student "${data.data.name}" added!`);
      setForm(EMPTY_FORM);
    } catch {
      setAddError("Request failed");
    }
  }

  function handleUploaded(studentId, doc) {
    setStudents((prev) =>
      prev.map((s) => s._id === studentId ? { ...s, document: doc } : s)
    );
    if (single && single._id === studentId) setSingle({ ...single, document: doc });
    setUploadingFor(null);
  }

  const rows = single ? [single] : students;

  return (
    <div style={{ padding: "20px", color: "#f9fafb" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
        <h2 style={{ margin: 0 }}>Students</h2>
        <button
          onClick={() => { setShowAdd((v) => !v); setAddError(""); setAddSuccess(""); }}
          style={{ padding: "6px 14px", background: showAdd ? "#374151" : "#059669", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          {showAdd ? "Cancel" : "+ Add Student"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} style={{ background: "#1f2937", padding: "16px", borderRadius: "8px", marginBottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Name *
            <input required style={INPUT_STYLE} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Zehut *
            <input required style={INPUT_STYLE} value={form.zehut} onChange={(e) => setForm({ ...form, zehut: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Degree *
            <input required style={INPUT_STYLE} value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
            Year *
            <input required type="number" min="1" style={INPUT_STYLE} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px", gridColumn: "1 / -1" }}>
            Phone
            <input style={{ ...INPUT_STYLE, width: "calc(50% - 5px)" }} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: "8px", alignItems: "center" }}>
            <button type="submit" style={{ padding: "8px 20px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
              Save Student
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
          placeholder="Search by _id or zehut"
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
      {!loading && rows.length === 0 && <p style={{ color: "#9ca3af" }}>No students found.</p>}

      {!loading && rows.length > 0 && (
        <table style={TABLE_STYLE}>
          <thead>
            <tr>
              <th style={TH_STYLE}>Zehut</th>
              <th style={TH_STYLE}>Name</th>
              <th style={TH_STYLE}>Degree</th>
              <th style={TH_STYLE}>Year</th>
              <th style={TH_STYLE}>Phone</th>
              <th style={TH_STYLE}>Document</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((stu, i) => (
              <tr key={stu._id} style={i % 2 === 0 ? ROW_NORM : ROW_ALT}>
                <td style={TD_STYLE}>{stu.zehut}</td>
                <td style={TD_STYLE}>{stu.name}</td>
                <td style={TD_STYLE}>{stu.degree}</td>
                <td style={TD_STYLE}>{stu.year}</td>
                <td style={TD_STYLE}>{stu.phone ?? "—"}</td>
                <td style={TD_STYLE}>
                  <DocumentCell doc={stu.document} />
                  <div>
                    <button
                      onClick={() => setUploadingFor(uploadingFor === stu._id ? null : stu._id)}
                      style={{ marginTop: "4px", padding: "3px 8px", background: "#374151", color: "#d1d5db", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "11px" }}
                    >
                      {uploadingFor === stu._id ? "Cancel" : "Upload file"}
                    </button>
                    {uploadingFor === stu._id && (
                      <UploadForm studentId={stu._id} onUploaded={handleUploaded} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
