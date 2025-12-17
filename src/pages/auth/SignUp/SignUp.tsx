import { useState, type ChangeEvent, type FormEvent } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ApiClient from "../../../utils/ApiClient";
import AuthLayout from "../../../components/layout/AuthLayout";

export default function SignUp() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await ApiClient.post("/signup", form);
      navigate("/signin", { replace: true });
    } catch (err: any) {
      alert(err?.response?.data?.message || "Signup gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Get started"
      subtitle="Create your GoalSync account in seconds"
    >
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-4">
          <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "8px" }}>Full name</Form.Label>
          <Form.Control
            name="username"
            placeholder="John Doe"
            value={form.username}
            onChange={onChange}
            required
            style={{ fontSize: "14px", borderColor: "#e5e7eb", padding: "10px 12px" }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "8px" }}>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={onChange}
            required
            style={{ fontSize: "14px", borderColor: "#e5e7eb", padding: "10px 12px" }}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label style={{ fontSize: "14px", fontWeight: "500", color: "#111827", marginBottom: "8px" }}>Password</Form.Label>
          <Form.Control
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
            required
            style={{ fontSize: "14px", borderColor: "#e5e7eb", padding: "10px 12px" }}
          />
          <Form.Text style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>
            At least 6 characters recommended
          </Form.Text>
        </Form.Group>

        <Button 
          type="submit" 
          className="w-100" 
          disabled={isLoading}
          style={{ 
            backgroundColor: "#6366f1", 
            borderColor: "#6366f1",
            fontSize: "14px",
            fontWeight: "600",
            padding: "10px 16px",
            marginBottom: "16px"
          }}
        >
          {isLoading ? <Spinner size="sm" /> : "Create account"}
        </Button>

        <div style={{ textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
          Already have an account?{" "}
          <NavLink to="/signin" style={{ color: "#6366f1", fontWeight: "600", textDecoration: "none" }}>
            Sign in
          </NavLink>
        </div>
      </Form>
    </AuthLayout>
  );
}
