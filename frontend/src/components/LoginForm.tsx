import { useState } from "react";

interface LoginFormProps {
  onSuccess: (token: string, user: any) => void;
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      localStorage.setItem("token", data.data.token);
      onSuccess(data.data.token, data.data.user);
    } catch {
      setError("Could not connect to server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", padding: "32px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 12 }}>
      <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 500 }}>Sign in to SCMS</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "var(--color-text-secondary)" }}>
            College email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@rishihood.edu.in"
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6, color: "var(--color-text-secondary)" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", fontSize: 14, boxSizing: "border-box" }}
          />
        </div>

        {error && (
          <div style={{ marginBottom: 16, padding: "10px 12px", background: "#FCEBEB", color: "#791F1F", borderRadius: 8, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "11px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "var(--color-text-secondary)" }}>
        No account?{" "}
        <button onClick={onSwitchToRegister} style={{ background: "none", border: "none", color: "#534AB7", cursor: "pointer", fontSize: 13 }}>
          Register here
        </button>
      </p>
    </div>
  );
}