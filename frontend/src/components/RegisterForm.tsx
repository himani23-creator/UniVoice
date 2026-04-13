import { useState } from "react";
import { UserRole } from "../types";

interface RegisterFormProps {
  onSuccess: (token: string, user: any) => void;
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "student" as UserRole,
    gender: "", department: "", yearOfStudy: 1,
    rollNumber: "", course: "",
    employeeId: "", designation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.data.token);
      onSuccess(data.data.token, data.data.user);
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: "0.5px solid var(--color-border-secondary)", fontSize: 14, boxSizing: "border-box" as const,
  };
  const labelStyle = { display: "block" as const, fontSize: 13, marginBottom: 6, color: "var(--color-text-secondary)" };
  const fieldStyle = { marginBottom: 14 };

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "32px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 500 }}>Create your account</h2>

      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Full name</label>
          <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" required />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>College email</label>
          <input style={inputStyle} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@rishihood.edu.in" required />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Password</label>
          <input style={inputStyle} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="Min 8 characters" required />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Role</label>
            <select style={inputStyle} value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select style={inputStyle} value={form.gender} onChange={(e) => set("gender", e.target.value)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={labelStyle}>Department</label>
            <input style={inputStyle} value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. CSE" required />
          </div>
          <div>
            <label style={labelStyle}>Year of study</label>
            <input style={inputStyle} type="number" min={1} max={6} value={form.yearOfStudy} onChange={(e) => set("yearOfStudy", Number(e.target.value))} />
          </div>
        </div>

        {/* Student-specific */}
        {form.role === "student" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Roll number</label>
              <input style={inputStyle} value={form.rollNumber} onChange={(e) => set("rollNumber", e.target.value)} placeholder="e.g. RU2024001" />
            </div>
            <div>
              <label style={labelStyle}>Course</label>
              <input style={inputStyle} value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="e.g. B.Tech CSE" />
            </div>
          </div>
        )}

        {/* Faculty-specific */}
        {form.role === "faculty" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Employee ID</label>
              <input style={inputStyle} value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} placeholder="e.g. FAC001" />
            </div>
            <div>
              <label style={labelStyle}>Designation</label>
              <input style={inputStyle} value={form.designation} onChange={(e) => set("designation", e.target.value)} placeholder="e.g. Assistant Professor" />
            </div>
          </div>
        )}

        {error && (
          <div style={{ marginBottom: 16, padding: "10px 12px", background: "#FCEBEB", color: "#791F1F", borderRadius: 8, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 11, background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
        Already have an account?{" "}
        <button onClick={onSwitchToLogin} style={{ background: "none", border: "none", color: "#534AB7", cursor: "pointer", fontSize: 13 }}>
          Sign in
        </button>
      </p>
    </div>
  );
}